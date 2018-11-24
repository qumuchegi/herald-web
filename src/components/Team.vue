<template lang="pug">
    #body 
        ul 
          li(@click= "clickToSearch(isQuery)",:class="{isadmin:user.cardnum==='213163480'}") 搜team
          li(@click= "clickToFindMate",:class="{isadmin:user.cardnum==='213163480'}") 招队员
          li(@click= "clickToManage",:class="{isadmin:user.cardnum==='213163480'}") 我的
          li.isadmin(@click= "clickToAdmin",v-if= "user.cardnum==='213163480'") 管理者
        p#query-input(v-if= 'isQuery')
          input(v-model= 'queryStr',placeholder= "输入竞赛名/发起人名/一卡通")
          button(@click= "getWantsOnPage_Of(3,page)") 搜索
          button(@click= 'cancelQuery') 取消
        #turn-page 
          span#ast-page(v-if= "page > 1",@click= "getLastPage") 上一页
          span(v-if= "page===1",style="color: white") 占位符
          span(style="margin-left: 28.5%") 第{{page}}页
          span#next-page(v-if= "wantInfo.length===6",@click= "getNextPage" ) 下一页
        div#fresh(@click="getWantsOnPage_Of(1,page)") 刷新列表
        div#nomore(v-if= "wantInfo.length===0") 无更多召集令
        #want-container 
          #want-item(v-for= "wantItem in wantInfo",v-if="wantInfo.length!==0",:key= "wantItem.id" )
            hr.divider 
            #want-project-title 
                span {{ wantItem.projectName }}
                span(style="float: right;color:rgb(188, 199, 199)") 发布于{{publishedData_unixTOnormal( wantItem.publishedDate ).YMD}}
                span.new(v-if="istimeNew(wantItem.publishedDate)") 新
            div(style= "display: inline-block; padding: 2% 2% 3% 2%")
                #present-members 
                    span(style= 'padding-top:1%;padding-bottom:1%;background-color : rgba(74,169,192);color : aliceblue;border-radius : 2px 0 0px 2px') 目前组员
                    span(style= 'border-style:solid;border-width:1px;border-radius:0 3px 3px 0;color :rgba(74,169,192)')   {{ wantItem.currentPeople.length }}/{{ wantItem.maxPeople }}
                #want-publisher 
                    span(style= 'padding-top:1%;padding-bottom:1%;background-color : rgba(74,169,192);color : aliceblue;border-radius : 2px 0 0 2px') 发布人
                    span(style= 'border-style:solid;border-width:1px;border-radius:0 3px 3px 0;color : rgba(74,169,192)')  {{ wantItem.masterName }}
            button(style= 'float: right; margin-right: 2%',@click= "clickToDetails(wantItem.tid)") 详情
   </template>

<script>
    import api from '@/api'
    import Vue from 'vue'
 
    export default{
        props: [ 'user' ],
        created() {
           this.getWantsOnPage_Of(1,this.page);
           let now = new Date();
            this.now.Y = now.getFullYear();
            this.now.M = now.getMonth();
            this.now.D = now.getDate();
        },
       data() {
           return {
                   now : {},
               showTab : 1,        
                  type :1,            //搜索类，1 获取所有组队，3 搜索特定组队
               isQuery : false,       // 搜索框是否渲染的状态，false默认不渲染
              queryStr : '',          // 获取搜索框input 的项目名称
                  page : 1,           // 获取对应页数的组队项
              wantInfo : [],      // post请求到后端所有的召集令后存到这个数组中用于将其列表渲染出来
             hasapplyed : false,   // 提交申请表单后socket会将申请信息同时发送给召集令的发布者和保存到后端的数据库，如果这个操作过程成功则这个hasapply为true
          applyWant_ID : '',      // 用于在已经渲染出来的召集令列表中获取某一个召集令在数据库的ID，在“确认申请”后用这个ID创建一个申请信息
                                  // 也就是把这个ID当作这条申请信息的一个字段，（这个ID就把申请者和这个召集令联系起来了），
                                  // 以后申请者通过这个ID可以查询到自己申请了哪些召集令及该召集令的动态信息（如新增了哪些成员）
         }
    },
    methods: {
        async getWantsOnPage_Of(type,page) {
            if(type === 3){
                let queryStr= this.queryStr;
                console.log('搜索type，page,queryStr', type,page,queryStr)
                if(this.queryStr === '') {
                    Vue.toasted.show('请输入搜索竞赛')
                }else{
                    this.type = 3;
                    let postData= { type:3,  page: page, param:JSON.stringify({projectName:queryStr})  };
                    console.log(postData)
                     let res= await api.get('/api/team', postData)
                     this.wantInfo = res.data;
                     console.log('搜索res',this.wantInfo)
                }
            };
            if(type===1){
                console.log('获取组队项：type,page',type,page)
                let res = await api.get('/api/team', { type:type, page:page});
                this.wantInfo = res.data;
                console.log('this.wantInfo',this.wantInfo)
            }
        },
        getNextPage(){
            this.page++;
            this.getWantsOnPage_Of(this.type,this.page);
        },
        getLastPage(){
            this.page--;
            this.getWantsOnPage_Of(this.type,this.page);

        },
        clickToSearch() {
            this.showTab = 1;
            this.isQuery = true;
        },
        cancelQuery() {
            this.type = 1;
            //this.page =1;
            this.getWantsOnPage_Of(1,this.page);
            this.isQuery = false;
        },
        clickToFindMate() {
            this.showTab = 2;
            this.$router.push( { path: '/callmember' } ); //转到发布召集令的页面
        },
        clickToManage() {
            this.showTab = 3;
            this.$router.push( { path: '/manage' } );
        },
        isapplyJoin(Want_ID,want_Master) {//唤起申请需要填写的表单，在表单填写完确定后才会真正发送申请
            console.log('tid',Want_ID,'masterName',want_Master)
            this.isapply = true;
            this.applyWant_ID = Want_ID;
        }
        ,
        clickToDetails(tid){
            this.$router.push({name: '召集令详情', params: {wantid:tid}})
        },
        clickToAdmin(){
            this.$router.push({name: '组队管理'})
        },
        publishedData_unixTOnormal(unixtime){
          let unixTimestamp = new Date(unixtime * 1000);
          let Y = unixTimestamp.getFullYear();
          let M = ((unixTimestamp.getMonth() + 1) > 10 ? 
                   (unixTimestamp.getMonth() + 1) : 
                   '0' + (unixTimestamp.getMonth() + 1));
          let D = (unixTimestamp.getDate() > 10 ? 
                   unixTimestamp.getDate() : 
                   '0' + unixTimestamp.getDate());
           return  {Y,M,D,YMD:`${Y}-${M}-${D}`};
        },
        istimeNew(unixtime){//判断是否是新want标准是距离天数<1
                let {Y,M,D} = this.publishedData_unixTOnormal(unixtime);
                return (this.now.Y > Y) ? (this.now.M > M ? false : (12-M)>=1 ? false : (31-D+(this.now.M-1)*31+this.now.D)>1 ? false:true)
                                        : this.now.M > M ? (31-D+(this.now.M-1)*31+this.now.D)>1 ? false:true 
                                        : this.now.D-D > 1 ? false : true
            },


    }
}
</script>

<style scoped>
#body{
    background-color: white
}
ul li{
    display: inline-block;
    margin-left: 13%;
    font-weight:200%;
    color:rgba(74,169,192);
}
.isadmin{
    display: inline-block;
    margin-left: 7%;
    color:rgba(74,169,192)
}
#turn-page{
    margin-left: 10%;
    margin-bottom: 0
}
#next-page{
    float: right;
    margin-right: 10%;
}
.divider{
    margin: 1%;
}
#nomore{
    color: rgba(86,183,209);
    text-align: center
}
#hasapplyed-warn{
    position: fixed;
    z-index: 12;
    top:30%;
    left:14%;
    color:brown;
    font-size: 110%;
    background-color: rgba(54, 145, 161, 0.158);
    border-radius: 5px;
    padding: 6%;
    padding-bottom: 1%
}
#want-container{
    margin-top: 0%;
    padding-bottom: 0%
}
#want-item{
    border-radius: 3px;
    margin: 2% ;

}
#want-project-title{
    color:rgb(36, 110, 116);
    border-radius: 3px;
    padding-bottom: 3.12%
}
#want-publisher{
    border-radius: 3px;
    display: inline-block
}
#query-input input{
    width:73%;
    margin-left:1%;
    margin-top: 1%;
    margin-right: 0;
    background-color: azure
}
#query-input button{
    padding: 1.5% 2% 1.5% 2%;
    margin: 2% 0 0 0;
}
#present-members{
    display: inline-block;
}
.new{
    background-color: crimson;
    color:aliceblue;
    border-radius: 40%;
    margin-left: 10%;
    padding: 0.3%;
    float:right
}
#fresh{
    border-radius: 2%;
    width: 14%;
    margin-top: 0.6% ;
    margin-left:42%;
    margin-bottom: 0%;
    padding:1% 2% 1% 2%;
    background-color: rgba(110, 218, 226, 0.705)
}
</style>
