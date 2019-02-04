<template lang="pug">
    div#body
      h2 填写组队帖
      #call-form
       div  
            input#publisher-QQ(placeholder = "Q",v-model = "QQ") 
       hr
       div  
            input#publisher-name(placeholder = "队名",v-model = "teamName")
       hr
       div  
            input#publisher-comptation(placeholder = "竞赛名 :srtp 北斗杯……",v-model = "projectName")
       hr 
       div  
            input#publisher-num(placeholder = "预期小组人数>=1",v-model = "maxPeople")
       hr 
       div   
            input.deadLine(placeholder = "截止时间",type = "date",v-model = "endTime")
       hr
       div   
            textarea#publish-more(placeholder = "组队说明: 队员结构  招人条件 组队后分工安排 等.......",
                                   v-model = "description",rows = "10",cols = "30")
       button#publish-button(@click = "publishWantAd") 发布帖子
 </template>
<script>
    import api from '@/api';
    import Vue from 'vue'

    export default {
        props: [ 'user' ],
        data() {
           return {//召集令字段，将在后端入库，注释带* *的为新字段，带# #为以前保留的字段
                                  QQ : '',                     //发起人qq
                            teamName : '',                     //*发起人给团队起的名* 
                         projectName : '',                     //发起项目名
                           maxPeople : '',                     //发起人给团队设置的成员最大数量
                             endTime : '',                     //召集令截止时间,
                         description : '',                     //召集令描述
                                  now : {}
            }
       },
       created() {
            let now = new Date();
            this.now.Y = now.getFullYear();
            this.now.M = now.getMonth();
            this.now.D = now.getDate();
       },
       methods: { //向后端发送填好的召集令信息，后端接受后会保存
           async publishWantAd() {  
               let postdata= {  
                                    QQ : this.QQ, 
                              teamName : this.teamName,
                           projectName : this.projectName,
                             maxPeople : this.maxPeople,
                               endTime : this.endTime,
                           description : this.description,  

               };
                if(isNaN(this.maxPeople)){
                    return Vue.toasted.show('预期招人数不是有效数字')
                }
                if( 
                   this.QQ && 
                   this.teamName && 
                   this.projectName && 
                   this.maxPeople && 
                   this.endTime&&
                   this.description )
                {
                    try {
                        let res =  await api.post('/api/team', postdata);
                        //后端召集令入库后给前端的响应
                        res.status===0 ? Vue.toasted.show('已经发布！首页可以查看'): Vue.toasted.show('已经发布相同组队贴！');
                    }catch(err){
                        Vue.toasted.show(err)
                    }
                }else{
                Vue.toasted.show('请填写完整！！！')
                }
           },
       }
    }
</script>
<style scoped>
     #body{
        background-color: white;
        padding-top: 2%
        }
        h2{
            text-align: center;
            color:rgb(74, 169, 192);
        }
        #call-form{
            padding-left: 10%;
            padding-right: 10%
        }
        #call-form input{
            border: 1px solid rgb(74，169，192)
        }
       #publisher-QQ,#publisher-name,#publisher-comptation,#publisher-num,.deadLine,#publish-more{
        width:100%;
        margin-bottom: 3%;
         
       }
        hr{
            margin: 2%;
        }
        #published-alert,#hassamepublish{
            text-align : center;
            margin : 2% 20% 2% 20%;
            color : rgb(74，169，192);
            border : radius 3px;
            font-size : 130%
        }
         
        #publish-button{  
            padding: 1% 10% 1% 10%;
            position: relative;
            margin-left:30%;
            margin-top: 4%
        }
    
    
</style>