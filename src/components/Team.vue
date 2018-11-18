<template lang="pug">
    #body 
        ul 
          li(@click= "clickToSearch(isQuery)") 搜team
          li(@click= "clickToFindMate") 招队员
          li(@click= "clickToManage") 我的
        p#query-input(v-if= 'isQuery')
          input(v-model= 'queryStr',placeholder= "输入竞赛名/发起人名或一卡通")
          button(@click= "getWantsOnPage_Of(3,page)") 搜索
          button(@click= 'cancelQuery') 取消
        #turn-page 
          span#ast-page(v-if= "page > 1",@click= "getLastPage") 上一页
          span(v-if= "page===1",style="color: white") 占位符
          span(style="margin-left: 28.5%") 第{{page}}页
          span#next-page(v-if= "wantInfo.length===6",@click= "getNextPage" ) 下一页
        div(@click="getWantsOnPage_Of(1,page)",
            style="border-radius: 2%;width: 14%;margin-top: 0.6% ;margin-left:42%;margin-bottom: 0%;padding:1% 2% 1% 2%;background-color: rgba(110, 218, 226, 0.705)") 刷新列表
        div#nomore(v-if= "wantInfo.length===0") 无更多召集令
        #want-container 
          #want-item(v-for= "wantItem in wantInfo",v-if="wantInfo.length!==0",:key= "wantItem.id" )
            hr.divider 
            #want-project-title 
                span {{ wantItem.projectName }}
                span(style="float: right;color:rgb(188, 199, 199)") 发布于{{publishedData_unixTOnormal( wantItem.publishedDate )}}
            div(style= "display: inline-block; padding: 2% 2% 3% 2%")
                #present-members 
                    span(style= 'background-color : rgba(102,102,102);color : aliceblue;border-radius : 2px 0 0px 2px') 目前组员
                    span(style= 'background-color : rgb(71,137,174);color : white')   {{ wantItem.currentPeople.length }}/{{ wantItem.maxPeople }}
                #want-publisher 
                    span(style= 'background-color : rgba(102,102,102);color : aliceblue;border-radius : 2px') 发布人
                    span(style= 'background-color : rgb(125,214,105);color : white')  {{ wantItem.masterName }}
            button(style= 'float: right; margin-right: 2%',@click= "clickToDetails(wantItem.tid)") 详情
            button#apply-button(style= 'float: right;',@click= "isapplyJoin(wantItem.tid,wantItem.masterName)") 申请加入
            span#hasapplyed-warn(v-if= "isapply")
                    span(style= "margin-left: 5%; color:rgb(61,123,132)") 填写申请表以便于对方联系你
                    div 
                       div  
                        input(style= " ",placeholder="你的QQ",v-model= "applyFrom_QQ")
                       hr(style= "margin: 1%")
                       div 
                           textarea(v-model= "applyResonText" placeholder="个人简述")
                    hr(style= "margin: 2%")
                    button(@click= 'applyJoin(applyWant_ID)',
                            style= "font-size : 120%; color : deepskyblue;width:100%") 确认申请
                    button(@click= "isapply= false",
                            style= "font-size : 120%; color : deepskyblue;margin-top : 3%;width:100%") 取消
  </template>

<script>
    import api from '@/api'
    import Vue from 'vue'
 
    export default{
        props: [ 'user' ],
        created() {
           this.getWantsOnPage_Of(1,this.page);
        },
       data() {
           return {
               showTab : 1,        
                  type :1,            //搜索类，1 获取所有组队，3 搜索特定组队
               isQuery : false,       // 搜索框是否渲染的状态，false默认不渲染
              queryStr : '',          // 获取搜索框input 的项目名称
                  page : 1,           // 获取对应页数的组队项
              wantInfo : [],      // post请求到后端所有的召集令后存到这个数组中用于将其列表渲染出来
               isapply : false,   // 是否申请，申请中点击 “申请加入” 后唤出申请者信息的填写表单，这个 isapply 决定是否渲染这个表单
            hasapplyed : false,   // 提交申请表单后socket会将申请信息同时发送给召集令的发布者和保存到后端的数据库，如果这个操作过程成功则这个hasapply为true
          applyWant_ID : '',      // 用于在已经渲染出来的召集令列表中获取某一个召集令在数据库的ID，在“确认申请”后用这个ID创建一个申请信息
                                  // 也就是把这个ID当作这条申请信息的一个字段，（这个ID就把申请者和这个召集令联系起来了），
                                  // 以后申请者通过这个ID可以查询到自己申请了哪些召集令及该召集令的动态信息（如新增了哪些成员）
           applyFrom_QQ : '',      // 申请者的QQ
           applyResonText:'',     //申请者理由
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
        async applyJoin( id ) {
            if( this.applyResonText && this.applyFrom_QQ ) 
            {
                let res = await api.post('/api/team/registration', 
                { 
                    tid:id,
                    qq:this.applyFrom_QQ,
                    description:this.applyResonText
                });
                console.log('申请res:',res)
                this.isapply = false;
            }
            else
            Vue.toasted.show('请填写完整');   
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
          let toDay = Y + '-' + M + '-' + D;
          return  toDay;
        }

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
    color:rgba(64,123,134);
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
    background-color: antiquewhite;
   
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
#want-publisher{
   display: inline-block;
}
#apply-button{
     margin-right: 2%
}
</style>
