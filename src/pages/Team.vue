<template lang="pug">
    #body 
        ul 
          li(@click= "clickToSearch(isQuery)") 搜team
          li(@click= "clickToFindMate" ) 招队员
          li(@click= "clickToManage" ) 我的
          li.isadmin(@click= "clickToAdmin",v-if= "user.cardnum!=='213163480'") 管理者
        p#query-input(v-if= 'isQuery')
            select#querymodel( @change="changeQuerymodel") 
                option(value="projectName" selected) 竞赛名
                option(value="masterName") 发起人
                option(value="cardnum") 一卡通
            input(v-model= 'queryStr',placeholder= "竞赛名/发起人名/一卡通")
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
                span(style="float: right;color:rgb(188, 199, 199)") 发布于{{unixTOnormal( wantItem.publishedDate ).YMD}}
                span.new(v-if="istimeNew(wantItem.publishedDate)") 新
            div(style= "display: inline-block ")
                #present-members 
                    span(style= 'padding-top:1%;padding-bottom:1%;background-color : rgba(74,169,192);color : aliceblue;border-radius : 2px 0 0px 2px') 目前组员
                    span(style= 'border-style:solid;border-width:1px;border-radius:0 3px 3px 0;color :rgba(74,169,192)')   {{ wantItem.currentPeople.length }}/{{ wantItem.maxPeople }}
                #want-publisher 
                    span(style= 'padding-top:1%;padding-bottom:1%;background-color : rgba(74,169,192);color : aliceblue;border-radius : 2px 0 0 2px') 发布人
                    span(style= 'border-style:solid;border-width:1px;border-radius:0 3px 3px 0;color : rgba(74,169,192)')  {{ wantItem.masterName }}
            span(style= 'float: right; margin-right: 2%;color:rgba(74,169,192)',@click= "clickToDetails(wantItem.tid)") 详情
   </template>

<script>
    import api from '@/api'
    import Vue from 'vue'
 
    export default{
        props: [ 'user' ],
        created() {
           this.queryModel = 'projectName';
           this.getWantsOnPage_Of(1,this.page);
           let now = new Date();     //获取当前时间以与发布时间比较
            this.now.Y = now.getFullYear();
            this.now.M = now.getMonth();
            this.now.D = now.getDate();
        },
       data() {
           return {
                   now : {},
               showTab : 1,        
                  type : 1,           //搜索类，1 获取所有组队，3 搜索特定组队
               isQuery : false,       // 搜索框是否渲染的状态，false默认不渲染
              queryStr : '',          // 获取搜索框input 的项目名称
                  page : 1,           // 获取对应页数的组队项
              wantInfo : [],      // post请求到后端所有的召集令后存到这个数组中用于将其列表渲染出来
            hasapplyed : false,   // 提交申请表单后socket会将申请信息同时发送给召集令的发布者和保存到后端的数据库，如果这个操作过程成功则这个hasapply为true
          applyWant_ID : '',      // 用于在已经渲染出来的召集令列表中获取某一个召集令在数据库的ID，在“确认申请”后用这个ID创建一个申请信息
                                  // 也就是把这个ID当作这条申请信息的一个字段，（这个ID就把申请者和这个召集令联系起来了），
                                  // 以后申请者通过这个ID可以查询到自己申请了哪些召集令及该召集令的动态信息（如新增了哪些成员）
            queryModel : ''       // 搜索模式
         }
    },
    methods: {
        async getWantsOnPage_Of(type,page) {
            if(type === 3){
                let queryStr = this.queryStr;
                if(this.queryStr === '') {
                    Vue.toasted.show('请输入搜索竞赛')
                }else{
                    this.type = 3;
                    let querymodelMap = new Map();
                    querymodelMap.set(this.queryModel,queryStr);
                    let querymodelObj = {};
                    for (let [queryModel,queryStr] of querymodelMap)
                    querymodelObj[queryModel] = queryStr;
                    let postData= { type:3,  page: page, param:JSON.stringify(querymodelObj)};
                    let res= await api.get('/api/team', postData)
                    this.wantInfo = res.data;
                    console.log('搜索res',this.wantInfo)
                }
            };
            if(type===1){
                let res = await api.get('/api/team', { type:type, page:page});
                this.wantInfo = res.data;
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
            this.queryModel = 'projectName'
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
        unixTOnormal(unixtime){
          if(typeof(unixtime)==='string')return unixtime;
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
                let {Y,M,D} = this.unixTOnormal(unixtime);
                return (this.now.Y > Y) ? 
                        (this.now.M > M ? false : (12-M)>=1 ? false : 
                            (31-D+(this.now.M-1)*31+this.now.D)>1 ? 
                            false : true ) :
                            this.now.M > M ? 
                            (31-D+(this.now.M-1)*31+this.now.D)>1 ? false:true 
                            : this.now.D-D > 1 ? false : true
        },
        changeQuerymodel(){
                let that = document.getElementById('querymodel')
                this.queryModel = that.options[that.selectedIndex].value;
        }
    }
}
</script>

<style scoped>
#body{
    background-color: white;
    padding-top: 2%
}
ul li{
    color:black;
    display: inline-block;
    margin-left: 13%;
    font-weight:300%;
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
    color: rgb(74,169,192);
    text-align: center
}
#hasapplyed-warn{
    position: fixed;
    z-index: 12;
    top:30%;
    left:14%;
    color:brown;
    font-size: 110%;
    background-color: rgba(74,169,192);
    border-radius: 5px;
    padding: 6%;
    padding-bottom: 1%
}
#want-container{
    margin-top: 0%;
    padding-bottom: 0%;
    animation: wants 1s;
}
@keyframes wants{
    0% {opacity: 0;}
    20% {opacity: 0.1;}
    30% {opacity: 0.4;}
    50% {opacity: 0.7;}
    70% {opacity: 0.8;}
    100% {opacity: 1;}
    
}
#want-item{
    border-radius: 3px;
    margin: 2% ;
}
#want-project-title{
    color:rgb(74,169,192);
    border-radius: 3px;
    padding-bottom: 3.12%
}
#want-publisher{
    border-radius: 3px;
    display: inline-block
}
 
#query-input input{
    width:50%;
    margin-left:1%;
    margin-top: 1%;
    margin-right: 0;
    margin-bottom: 1.7%;
    padding-top: 1.6%;
    background-color: white;
    border-bottom: solid rgb(74,169,192) 1px;
    border-radius: 0
}
#querymodel{
    background-color: white;
    color:rgb(74,169,192);
    padding: 2% 1% 2% 1%;
    margin-left: 0;
    border-style: none;
    border-width: 0
}
#query-input button{
    padding: 1.5% 2% 1.5% 2%;
    margin: 2% 0 0 0;
}
#present-members{
    display: inline-block;
}
.new{
    background-color: rgb(244,211,127);
    color:aliceblue;
    border-radius: 40%;
    margin-left: 10%;
    padding: 0.3%;
    float:right
}
#fresh{
    border-radius: 2%;
    margin-top: 0.6% ;
    margin-left:41.4%;
    margin-bottom: 0%;
    padding:1% 2% 1% 2%;
    color: rgb(74,169,192)
 }
</style>
