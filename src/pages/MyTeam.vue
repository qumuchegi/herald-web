<template lang = "pug">
    div#body
      ul#tab 
          li(:class="{selected: show===1}",@click= "show=1") 我的申请
          li(:class="{selected: show===2}",@click= "show=2") 接收申请
          li(:class="{selected: show===3}",@click= "show=3") 我的发布
      #remove-dialogue(v-if="isRemove_publish")
          h4 是否删除此组队帖？
          button(@click="removePublish(id,true)") 彻底删除
          button(@click="removePublish(id,false)") 从首页隐藏
          button(@click="cancelremovePublish(id)") 取消
      #remove-dialogue(v-if="isRemove_apply")
          h4 是否撤销此申请？
          button(@click="removeApply(id,false)") 撤销但在我的记录里保留
          button(@click="removeApply(id,true)") 撤销并从我的记录里删除
          button(@click="cancelremoveApply(id)") 取消  
      #container       
        div.applys(v-for= "(myapplyItem,index) of myapplys", 
                   v-if= "show==1", 
                   :class="[{applypass: myapplyItem.status===1},{appplyreject: myapplyItem.status===1}]")
            hr 
            div.title
                span.name {{ myapplyItem.projectName }}
                span.showApply(@click="isapplyshow=index") 展开>
                span.time 申请于{{unixTOnormal(myapplyItem.requestTime)}}
            hr
            div.applydetails(v-if='isapplyshow===index')
                div
                    span.key 申请竞赛类
                    span.value {{ myapplyItem.projectName }}
                hr
                div
                    span.key 团队名
                    span.value {{myapplyItem.teamName}}
                hr
                div
                    span.key 发起时间
                    span.value {{unixTOnormal(myapplyItem.updateTime)}}
                hr
                div
                    span.key 申请时间
                    span.value {{unixTOnormal(myapplyItem.requestTime)}}
                hr
                div
                    span.key 我的qq
                    span.value(v-if="isModify_apply_start!==index") {{myapplyItem.QQ}}
                    input(v-if="isModify_apply_start===index",v-model="modified_qq_apply",style="width:60%")
                hr
                div
                    span.key 申请状态
                    span.value {{myapplyItem.status===0 ? '申请当中' : myapplyItem.status===1 ? '申请成功' :myapplyItem.status===2 ? '申请被拒绝' :myapplyItem.status===3?'已取消申请':'组队已弃置'}}
                hr
                div
                    button.key(@click="clickToDetails(myapplyItem.tid)",
                            v-if="myapplyItem.status===0||myapplyItem.status===1||myapplyItem.status===2||myapplyItem.status===3",
                            style='margin-left:2%') 团队详情>
                    span(v-if="myapplyItem.status===4",style="margin-left:5%") 此团队已经被弃置
                hr
                div 
                    span.key 通过或拒绝的理由
                    span.value {{myapplyItem.responseText}}
                hr
                p 
                    div.key 个人简述
                    p(v-if="isModify_apply_start!==index",style="margin-left:5%;color:rgba(74,169,192)") {{myapplyItem.description}}
                    textarea(v-if="isModify_apply_start===index",v-model="modified_description_apply" ,rows="5" )     
                div(style="margin: 5% 20% 5% 36%",v-if="myapplyItem.status===0")
                    button(v-if="isModify_apply_start!==index"
                        style="background-color:rgba(230,249,253);padding: 3%;margin-left: 4%",
                        @click="WillmodifyApply(myapplyItem.rid,index)") 修改
                    button(v-if="isModify_apply_start!==index"
                        style="background-color:rgba(230,249,253);padding: 3%;margin-left: 4%",
                        @click="WillremoveAppl(myapplyItem.rid)") 撤销
                    button(style="background-color:rgba(230,249,253);padding: 3%;margin-left: 4%",
                            @click="cancelmodifyApply(id)",
                            v-if="isModify_apply_start===index") 取消
                    button(style="background-color:rgba(230,249,253);padding: 3%;margin-left: 4%",
                            @click="submitmodifyApply(id)",
                            v-if="isModify_apply_start===index") 完成

        div.applys(v-for= "(applyTomeItem,index) of applyToMe",v-if= "show==2 && applyTomeItem.status!==2")

            hr
            div.title
                span.name {{ applyTomeItem.applicantName }}
                span.showApply(@click="isothersapplyshow=index") 展开>
                span.time 申请于{{unixTOnormal(applyTomeItem.requestTime)}}
            hr
            div(v-if="isothersapplyshow===index")
                div
                span.key 申请人
                span.value {{applyTomeItem.applicantName}}
                hr
                div
                span.key 申请时间
                span.value {{unixTOnormal(applyTomeItem.requestTime)}}
                hr
                div
                span.key 申请人QQ
                span.value {{applyTomeItem.QQ}}
                hr   
                div
                span.key 申请项目
                span.value {{applyTomeItem.projectName}} 
                hr   
                div
                span.key 个人简述
                p(style="font-size:50%;margin-left:5%;color:rgba(74,169,192)") {{applyTomeItem.description}}
                hr
                p 
                span.key 申请处理 
                span.value(v-if="applyTomeItem.status===1") 已经给予通过
                span.value(v-else-if="applyTomeItem.status===2") 已经给予拒绝
                span(v-else)
                        div 
                        textarea(v-model="text",style="width: 80%",placeholder="填写通过或拒绝的理由 (选填)")
                        div(style="margin-top: 5%;margin-left:20%")
                        button(style="margin-left: 10%",@click="pass(applyTomeItem.rid,text)") 给予通过
                        button(style="margin-left: 10%",@click="reject(applyTomeItem.rid,text)") 给予拒绝
        div.my-publish(v-for= "(mypublishItem,index) of mypublish",v-if="show==3")
            hr
            div.title
                span.name {{  mypublishItem.projectName }}
                span.name {{mypublishItem.status===5?"管理员已删除":mypublishItem.status===4?'首页已隐藏':mypublishItem.status===1?'过期':'正常发布'}}
                span.showApply(@click="isPublishShow=index") 展开>
                span.time 发布于{{unixTOnormal(mypublishItem.publishTime)}}
            table(v-if='isPublishShow===index')
                tr 
                 td.block1 
                  table(style="width:100%;margin:0;padding:0;border-width:0")
                   td(v-if="isModify_pub_start!==index")
                    tr.key 竞赛类别
                    tr.value(v-if="isModify_pub_start!==index") {{ mypublishItem.projectName }}
                   td
                    tr.key 帖子状态
                    tr.value
                     p(v-if="isModify_pub_start!==index",style="margin-left:2%;font-size:70%") {{mypublishItem.status===5?"管理员已删除":mypublishItem.status===4?'首页已隐藏':mypublishItem.status===1?'过期':'正常发布'}}
                     p(v-if='mypublishItem.status===5',style="color:rgba(123,23,45);font-size:60%") 管理员：{{mypublishItem.msg}}
                    tr
                    input(v-model="modified_peojectName=mypublishItem.projectName",style="width: 80%",v-if="isModify_pub_start===index")                  
                 td.block1 
                    tr.key 团队名
                    tr.value(v-if="isModify_pub_start!==index") {{mypublishItem.teamName}}
                    tr
                    input(v-model="modified_teamName=mypublishItem.teamName",style="width: 80%",v-if="isModify_pub_start===index")
                tr 
                 td.block 
                    tr.key 发起人及组员
                    tr.value {{ mypublishItem.masterName }}（发起人）
                    tr.value(v-for="one of mypublishItem.currentPeople", 
                            v-if="one.name!==mypublishItem.masterName") {{ one.name }}  
                 td.block 
                    tr.key 发起人qq
                    tr.value(v-if="isModify_pub_start!==index") {{ mypublishItem.QQ }}
                    tr
                    input(v-model="modified_qq=mypublishItem.QQ",style="width: 80%",v-if="isModify_pub_start===index")
                tr 
                 table(style="width:100%;margin:0;padding:0;border-width:0")
                    td.block(v-if="isModify_pub_start!==index")
                        tr.key 发布时间
                        tr.value {{unixTOnormal(mypublishItem.publishTime)}}
                    td.block 
                        tr.key 截止时间
                        tr.value(v-if="isModify_pub_start!==index") {{unixTOnormal(mypublishItem.endTime)}}
                        tr
                        input(type='date',v-model="modified_deadLine",style="width: 80%",v-if="isModify_pub_start===index")
                 td.block 
                    tr.key 预期招人
                    tr.value(v-if="isModify_pub_start!==index") {{mypublishItem.maxPeople}}
                    tr 
                    input(v-model="modified_maxPeople=mypublishItem.maxPeople",style="width: 80%",v-if="isModify_pub_start===index")
            #description(v-if='isPublishShow===index')
                 .key 组队说明
                 p.value(v-if="isModify_pub_start!==index",style="font-size:50%") {{mypublishItem.description}}
                 textarea(v-model="modified_description=mypublishItem.description" ,rows="5",v-if="isModify_pub_start===index") 
            div(style="margin: 5% 20% 5% 36%",v-if='isPublishShow===index')
                  button(v-if="isModify_pub_start!==index && mypublishItem.status!==5 && mypublishItem.status!==4",
                        @click="WillmodifyPub(mypublishItem.tid,index)") 修改
                  button(v-if="isModify_pub_start!==index && mypublishItem.status!==5 && mypublishItem.status!==4",
                        @click="willremovePub(mypublishItem.tid)") 删除
                  button(v-if="isModify_pub_start===index",
                        @click="cancelmodifyPublish(mypublishItem.tid,index)") 取消
                  button(v-if="isModify_pub_start===index", 
                        @click="submitModify_pub(mypublishItem.tid)") 完成    

</template>
<script>
    import api from '@/api';
    import Vue from 'vue';
 
    export default {

        props: [ 'user' ],
        data() {

            return {
                         show : 1, // 默认渲染“我的teams”
                    mypublish : [],// 保存后端查询返回的团队信息（并没有独立的团队信息数据库，而是从召集令中提取）主要是团队成员变化都会变化在召集令的数据库里
                     myapplys : [],// 保存后端返回的我向别人的申请信息
                    applyToMe : [],// 保存后端返回的别人向我的申请信息
                         page : 1,
                         text : '',
             isRemove_publish : false,    
               isRemove_apply : false,
                         hard : false, //是否从数据库删除
                           id : '',    //要删除的召集令和申请的id
           isModify_pub_start : -1,
        isModify_pub_finished : false,
         isModify_apply_start : false,
      isModify_apply_finished : false,
                    ///////////用于修改召集令时的中间变量
            modified_deadLine : '',
           modified_maxPeople : '',
         modified_peojectName : '',
                  modified_qq : '',
            modified_teamName : '',
         modified_description : '',
                   //////////用于修改申请时的中间变量
   modified_description_apply : '',
            modified_qq_apply : '',
                  isapplyshow : -1,
            isothersapplyshow : -1,
                isPublishShow : -1
          
                }
       },
       created() {
           this.getMy_published_apply();  
         },
       methods: {
            async getMy_published_apply() {
                console.log('正在请求type=2')
                let res = await api.get('/api/team', {type:2, page:this.page});
                let {published, requested, received} = res;
                console.log('published',published)
                console.log('requested',requested)
                console.log('received',received)
                this.mypublish = published; //published, 我发布的项目
                this.myapplys = requested;  //requested, 我提交的申请
                this.applyToMe = received;  //received,  我收到的申请
            },   
            async pass(rid,text='没有填写理由'){
                try{
                    let res = await api.post("/api/team/reply",{rid:rid,text:text,response:true})
                    console.log(res.status)
                    if(res.status===0){
                       Vue.toasted.show('已通过')
                    }
                }catch(err){
                    Vue.toasted.show('申请者已经撤销申请')
                }
                
            },
            async reject(rid,text='没有填写理由'){
                try{
                    let res = await api.post("/api/team/reply",{rid:rid,text:text,response:false})
                    console.log(res.status)
                    if(res.status===0){
                       Vue.toasted.show('已拒绝')
                    }
                }catch(err){
                    Vue.toasted.show('申请者已经撤销申请')        
                } 
            },
            unixTOnormal(unixtime){ 
                if(typeof(unixtime)==='string')return unixtime;
                let unixTimestamp = new Date(unixtime * 1000);
                let Y = unixTimestamp.getFullYear();
                let M = ((unixTimestamp.getMonth() + 1) > 10 ? 
                         (unixTimestamp.getMonth() + 1) : '0' + (unixTimestamp.getMonth() + 1));
                let D = (unixTimestamp.getDate() > 10 ? 
                         unixTimestamp.getDate() : '0' + unixTimestamp.getDate());
                let toDay = Y + '-' + M + '-' + D;
                return  toDay;
            },
            clickToDetails(tid){
                this.$router.push({name: '召集令详情', params: {wantid:tid}})
            },
            willremovePub(tid){
                this.isRemove_publish = true;
                this.id = tid;
            },
            WillremoveAppl(rid){
                this.isRemove_apply = true;
                this.id = rid;
            },
            WillmodifyPub(tid,index){
                this.isModify_pub_start = index
                this.id = tid;
            },
            WillmodifyApply(rid,index){
                this.isModify_apply_start = index;
                this.id = rid;
            },
            cancelremovePublish(tid){
                this.isRemove_publish = false;
                this.isModify_pub_start = false
            },
            cancelremoveApply(tid){
                this.isRemove_apply = false
            },
            cancelmodifyPublish(tid,index){
                this.isModify_pub_start = -1;
                
            },
            cancelmodifyApply(rid){
                this.isModify_apply_start = false
            },
            async removePublish(id,hard){   //删除召集令
                console.log(typeof(hard))
                let res = await api.delete('/api/team', {tid:id,hard:hard});
                if(res.status===0){
                    Vue.toasted.show('删除成功');
                    this.isRemove_publish = false
                };
                this.getMy_published_apply()
            },
            async removeApply(id,hard){   //撤销申请
                let res = await api.delete('/api/team/registration', {rid: id, hard:hard});
                if(res.status===0){
                    Vue.toasted.show('撤销成功');
                    this.isRemove_apply = false
                };
                this.getMy_published_apply()
            },
            async submitModify_pub(tid){
                let putData = {
                            tid,
                             QQ : this.modified_qq,
                       teamName : this.modified_teamName,
                    projectName : this.modified_peojectName,
                      maxPeople : this.modified_maxPeople,
                       deadLine : this.modified_deadLine ,
                    description : this.modified_description
                }
                if(!this.modified_deadLine) return Vue.toasted.show('日期不能为空')
                try{
                    let res = await api.put('/api/team',putData);
                    if(res.status===0){
                       Vue.toasted.show('修改成功')
                    }
                    this.getMy_published_apply();
                    this.isModify_pub_start = false;
                    this.modified_qq
                    =this.modified_teamName
                    =this.modified_peojectName
                    =this.modified_maxPeople
                    =this.modified_deadLine
                    =this.modified_description=''
                }catch(err){
                    Vue.toasted.show(err)
                }
            },
            async submitmodifyApply(rid){
                let putData = {
                              rid,
                              QQ : this.modified_qq_apply,
                     description : this.modified_description_apply
                };
                if(this.modified_qq_apply && this.modified_description_apply){
                    let res = await api.put('/api/team/registration', putData);
                    if(res.status===0){
                        Vue.toasted.show('修改申请成功')
                    }
                    this.getMy_published_apply();
                    this.isModify_apply_start = false
                }else{
                Vue.toasted.show('请填写完整')
                }
            }
    },
}
</script>
<style scoped>
    #body{
        background-color: white;
        padding-top: 2%
    }
#tab{
     width:100%;
}
table{
    width:100%;
}
#tab li{
    display:inline-block;
    padding: 1% 2% 1% 2%;
    margin-left: 7%
}
#tab .selected{
    background-color: rgba(226,250,254);
    color:rgba(74,169,192)
}
h4{
    text-align: center;
    background-color:rgb(226,250,254);
    color:rgba(74,169,192);
    font-size: 120%;
}
.my-team{
    background-color: rgb(204, 220, 221);
    border-radius: 7px;
    margin: 0% 10% 0% 10%
}
.team-info{
    margin-left: 7%;
}
.team-creator{
    color: rgb(74,169,192);
    padding: 1% 2% 1% 2%;
    border-radius: 4px;
 
}
.team-member {
    color: rgb(74,169,192);
    padding: 1% 2% 1% 2%;
    border-radius: 4px;
 
}
.publish-details{
    color: rgb(154, 168, 180);
    padding: 1% 2% 1% 2%;
    border-radius: 4px;
    margin-top: 5%
}
 
.proj-details{
   
    margin: 1% 10% 1% 10%;
}
.proj-details h3{
    text-align: center;
    color: crimson;
    
}
table{   
    width:96%;
    margin-left: 2%;
    border-radius: 3%;
}
.block{
    margin-top: 2.5%;
    color:rgba(74,169,192);
    padding-left: 3%;
}
.block1{
    color:rgba(74,169,192);
    padding-left: 3%;
}
.key{
    color: rgb(154, 168, 180);
    padding-left: 3%
}
.value{
    color: rgba(74,169,192);
    font-size: 110%;
    padding-left: 20%
}
#description {
    padding-right: 3%;
    width:93%;
    margin-left:2%;
}
#remove-dialogue{
    width:60%;
    position: fixed;
    z-index: 2;
    top:15%;
    left:17%;
    background-color: aliceblue;
    color:brown;
    box-shadow: 1px 2px 2px 2px gray;
    border-radius: 5px;
    padding: 3%;
    margin-left: 0%;
    animation: dialogue 0.3s
}
#remove-dialogue button{
    width: 100%;
    margin:2%
}
#remove-dialogue h4{
    background-color: aliceblue;
    color:gray;
   
}
.rmapply{
    background-color: rgb(19, 12, 2)
}
#modify-pub{
    position: fixed;
    z-index: 12;
    top:2%;
    left:14%;
    color:brown;
    padding: 2% 5% 3% 5%;
    background-color: rgba(174，169，192)
}
#modify-apply{
    position: fixed;
    z-index: 12;
    top:6%;
    left:14%;
    color:brown;
    padding: 2% 5% 3% 5%;
    background-color: aqua
}
#modify-apply 
p.value{
    font-size: 50%
}
 
@keyframes dialogue{
    0% {opacity: 0;}
    20% {opacity: 0.1;}
    70% {opacity: 0.8;}
    100% {opacity: 1;}
}
textarea{
    width: 93%;
    margin-bottom:4%;
    margin-left:3%
}
.applys {
    width:94%;
    margin: 2% 3% 2% 3%;
    background-color: rgba(230,249,253);
    border-radius: 3px;
    padding-bottom: 3%
}
.applys .value{
    float: right;
    margin-right:6%
}
.applys hr{
    margin: 2.5%;
    width: 94%
}
.title{
     
}
.title .name{
    color: white;
    margin-left: 3%;
    background-color: rgb(74,169,192);
    padding: 0.4%;
    border-radius: 2px
}
.title .showApply{
    color:rgb(74,169,192);
    float:right;
    margin-right: 6%
}
.title .time{
    color:rgb(154, 168, 180);
    float:right;
    margin-right: 5%
}
.my-publish{
    
}
</style>