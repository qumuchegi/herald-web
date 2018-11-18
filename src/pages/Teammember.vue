<template lang="pug">
    div
      h2 填写召集令
      #call-form
       div: span.key QQ
            input#publisher-QQ(placeholder = "发布人QQ,用于后续联系",v-model = "qq") 
       hr
       div: span.key 队名
            input#publisher-comptation(placeholder = "队名",v-model = "teamName")
       hr
       div: span.key 竞赛
            input#publisher-comptation(placeholder = "竞赛名 :srtp 北斗杯……",v-model = "projectName")
       hr 
       div: span.key 预期小组人数
            input#publisher-num(placeholder = ">=1",v-model = "maxPeople")
       hr 
       div: span.key 截止时间
            input.deadLine(type = "date",v-model = "deadLine")
       hr
       div: span.key 组队说明
            textarea#publish-more(placeholder = "队员结构  招人条件 组队后分工安排 等.......",
                                   v-model = "description",rows = "10",cols = "30")
       button#publish-button(@click = "publishWantAd") 发布
       div#published-alert(v-if = "isPublished")  已发布  请返回刷新即可查看
       div#hassamepublish-alert(v-if = "hasPublishedSameProj") 已经有相同队名发布，请选择其他队名
</template>
<script>
    import api from '@/api';
    import Vue from 'vue'

    export default {
        props: [ 'user' ],
        data() {
           return {
               //召集令字段，将在后端入库，注释带* *的为新字段，带# #为以前保留的字段
                                  qq : '',                     //发起人qq
                            teamName : '',                     //*发起人给团队起的名* 
                         projectName : '',                     //发起项目名
                           maxPeople : '',                     //发起人给团队设置的成员最大数量
                            deadLine : '',                   //召集令截止时间,
                         description : '',                     //召集令描述
                         isPublished : false ,                 //后端有无保存成功召集令 后端数据库无此字段
                hasPublishedSameProj : false                   //后端是否查询到之前已经有相同竞赛的申请，后端数据库无此字段
            }
       },
       created() {

       },
       methods: {
           //向后端发送填好的召集令信息，后端接受后会保存
           async publishWantAd() {  
               let postdata= {  
                                    qq : this.qq, 
                              teamName : this.teamName,
                           projectName : this.projectName,
                             maxPeople : this.maxPeople,
                              deadLine : this.deadLine,
                           description : this.description,  

                        } ;
                console.log(postdata.deadLine);
                if( this.qq && 
                   this.teamName && 
                   this.projectName && 
                   this.maxPeople && 
                   this.deadLine&&
                   this.description )
                {
                    let res =  await api.post('/api/team', postdata);
                    //后端召集令入库后给前端的响应
                    console.log('res',res)
                    res.status===0 ? this.isPublished=true : this.hasPublishedSameProj=true;
                }else{
                Vue.toasted.show('请填写完整！！！')
                }
           },
       }
    }
</script>
<style scoped>
h2{
    text-align: center;
    color:rgb(74,169,192);
}
#call-form{
    padding-left: 10%;
    padding-right: 10%
}
#publish-button{
    margin-left: 34%;
    margin-top: 5%;
    padding: 1% 10% 1% 10%;
}
#publisher-name{
    margin-left: 4%;

}
#publisher-stunumber{
    margin-left: 8%;
}
#publisher-QQ{
    margin-left: 10%;
}
#publisher-comptation{
    margin-left: 8%;
}
#publisher-num{
    margin-left: 0.7%;
    width:20%
}
#publisher-more{
    margin-left: 4%;
}
hr{
    margin: 2%;
}
.deadLine{
    width: 50%
}
#published-alert,#hassamepublish{
    text-align : center;
    margin : 2% 20% 2% 20%;
    color : rgb(62,121,124);
    border : radius 3px;
    font-size : 130%
}
.key{
    color: rgb(74,169,192)
}
</style>