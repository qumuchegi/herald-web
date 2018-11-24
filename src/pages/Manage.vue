<template lang = "pug">
    div 
      ul#tab 
          li(:class="{selected: show===1}",@click= "show=1") 我的发布
          li(:class="{selected: show===2}",@click= "show=2") 我的申请
          li(:class="{selected: show===3}",@click= "show=3") 接收申请
      #remove-dialogue(v-if="isRemove_publish")
          h3 是否删除此召集令？
          button(@click="removePublish(id,true)",style="width:100%;margin:2%") 彻底删除
          button(@click="removePublish(id,false)",style="width:100%;margin:2%") 从首页隐藏
          button(@click="cancelremovePublish(id)",style="width:100%;margin:2%") 取消
      #remove-dialogue(v-if="isRemove_apply")
          h3 是否撤销此申请？
          button(@click="removeApply(id,true)",style="margin-left: 10%") 确认撤销
          button(@click="cancelremoveApply(id)",style="margin-left: 2%") 取消  
      #modify-apply(v-if="isModify_apply_start") 
          table 
             tr 
               span qq
               input(v-model="modified_qq_apply",style="width:60%")
             tr 
               span 个人简述
               textarea(v-model="modified_description_apply",style="width:100%")     
          div(style="margin: 3% 5% 2% 15%")
             span(style="background-color:rgba(230,249,253);padding: 3%",
                  @click="cancelmodifyApply(id)",
                   v-if="isModify_apply_start") 取消修改
             span(style="background-color:rgba(230,249,253);padding: 3%;margin-left: 3%;width:7%", 
                  @click="submitmodifyApply(id)",
                  v-if="isModify_apply_start") 完成修改
      #container 
        div.my-publish(v-for= "(mypublishItem,index) of mypublish",v-if="show==1")
            hr
            table 
              tr 
                td.block1 
                   tr.key 竞赛类别
                   tr.value(v-if="isModify_pub_start!==index") {{ mypublishItem.projectName }}
                   p(v-if="isModify_pub_start!==index",style="color:rgba(96,99,104);margin-left:2%;font-size:70%") {{mypublishItem.status===5?"管理员已删除":mypublishItem.status===4?'首页已隐藏':mypublishItem.status===1?'过期':'正常发布'}}
                   p(v-if='mypublishItem.status===5',style="color:rgba(123,23,45);font-size:60%") 管理员：{{mypublishItem.msg}}
                   tr
                     input(placeholder,v-model="modified_peojectName",style="width: 80%",v-if="isModify_pub_start===index")                  
                td.block1 
                   tr.key 团队名
                   tr.value(v-if="isModify_pub_start!==index") {{mypublishItem.teamName}}
                   tr
                     input(placeholder="mypublishItem.teamName",v-model="modified_teamName",style="width: 80%",v-if="isModify_pub_start===index")
              tr 
                td.block 
                   tr.key 发起人及组员
                   tr.value {{ mypublishItem.masterName }}（发起人）
                   tr.value(v-for="one of mypublishItem.currentPeople", 
                            v-if="one.name!==mypublishItem.masterName") {{ one.name }}  
                td.block 
                   tr.key 发起人qq
                   tr.value(v-if="isModify_pub_start!==index") {{ mypublishItem.qq }}
                   tr
                     input(placeholder="mypublishItem.qq",v-model="modified_qq",style="width: 80%",v-if="isModify_pub_start===index")
              tr 
                table(style="width:100%;margin:0;padding:0;border-width:0")
                   td.block
                       tr.key 发布时间
                       tr.value {{publishedData_unixTOnormal(mypublishItem.publishedDate)}}
                   td.block 
                       tr.key 截止时间
                       tr.value(v-if="isModify_pub_start!==index") {{publishedData_unixTOnormal(mypublishItem.deadLine)}}
                       tr
                         input(placeholder="publishedData_unixTOnormal(mypublishItem.deadLine)",type='date',v-model="modified_deadLine",style="width: 80%",v-if="isModify_pub_start===index")
                td.block 
                   tr.key 预期招人
                   tr.value(v-if="isModify_pub_start!==index") {{mypublishItem.maxPeople}}
                   tr 
                     input(placeholder="mypublishItem.maxPeople",v-model="modified_maxPeople",style="width: 80%",v-if="isModify_pub_start===index")
            #description
                .key 组队说明
                p.value(v-if="isModify_pub_start!==index",style="font-size:50%") {{mypublishItem.description}}
                textarea(placeholder="mypublishItem.description",v-model="modified_description",style="width: 100%;margin-bottom:4%",rows="6",v-if="isModify_pub_start===index") 
            div(style="margin: 5% 20% 5% 36%")
                  button(v-if="isModify_pub_start!==index && mypublishItem.status!==5 && mypublishItem.status!==4",
                        style="background-color:rgba(230,249,253);padding: 3%;margin-left: 4%", 
                        @click="WillmodifyPub(mypublishItem.tid,index)") 修改
                  button(v-if="isModify_pub_start!==index && mypublishItem.status!==5 && mypublishItem.status!==4",
                         style="background-color:rgba(230,249,253);padding: 3%;margin-left: 4%",
                         @click="willremovePub(mypublishItem.tid)") 删除
                  span(v-if="isModify_pub_start===index",
                       style="background-color:rgba(230,249,253);padding: 3%;margin-left: 4%",
                       @click="cancelmodifyPublish(mypublishItem.tid,index)") 取消修改 
                  span(v-if="isModify_pub_start===index", 
                       style="background-color:rgba(230,249,253);padding: 3%;margin-left: 4%",
                       @click="submitModify_pub(mypublishItem.tid)") 修改完成    
         
        div(v-for= "myapplyItem of myapplys", 
            v-if= "show==2",  
            :class="[{applypass: myapplyItem.status===1},{appplyreject: myapplyItem.status===2}]")
            hr
            table 
                tr 
                  td.block1 
                    tr.key 申请竞赛类
                    tr.value {{ myapplyItem.projectName }}
                  td.block1
                    tr.key 团队名
                    tr.value {{myapplyItem.teamName}}
                tr 
                  td.block 
                    tr.key 发起时间
                    tr.value {{publishedData_unixTOnormal(myapplyItem.updateDate)}}
                  td.block 
                    tr.key 申请时间
                    tr.value {{publishedData_unixTOnormal(myapplyItem.applicationDate)}}
                tr 
                  table(style="width:100%;margin:0;padding:0;border-width:0")
                    td.block 
                        span.key 个人简述
                        p.value {{myapplyItem.description}}
                    td.block 
                        tr.key 我的qq
                        tr.value {{myapplyItem.qq}}
                  td.block 
                    tr.key 申请状态
                    tr.value {{myapplyItem.status===0 ? '申请当中' : myapplyItem.status===1 ? '申请成功' :myapplyItem.status===2 ? '申请被拒绝' :null}}
                tr 
                  td.block 
                    span 团队详情
                    span(v-if="myapplyItem.status===4") 此团队已经被弃置
                  td.block 
                    tr.key 通过或拒绝的理由
                    tr.value {{myapplyItem.responseText}}
            div(style="margin: 5% 20% 5% 36%",v-if="myapplyItem.status===0")
                span(style="background-color:rgba(230,249,253);padding: 3%", 
                     @click="WillmodifyApply(myapplyItem.rid)") 修改
                span(style="background-color:rgba(230,249,253);padding: 3%;margin-left:10%",@click="WillremoveAppl(myapplyItem.rid)") 撤销
            
        div.applyToMe-item(v-for= "applyTomeItem of applyToMe",v-if= "show==3 ")
            hr
            table 
                tr 
                  td.block1
                    tr.key 申请人
                    tr.value {{applyTomeItem.applicant}}
                    span 申请于{{publishedData_unixTOnormal(applyTomeItem.applicationDate)}}
                  td.block1 
                    tr.key 申请人QQ
                    tr.value {{applyTomeItem.qq}}
                tr
                  td.block 
                    tr.key 申请项目
                    tr.value {{applyTomeItem.projectName}}（发布于{{publishedData_unixTOnormal(applyTomeItem.applicationDate)}}）
                  td.block 
                    tr.key 个人简述
                    tr.value(style="font-size:50%") {{applyTomeItem.description}}
            p 
              div.key 申请处理
              div.value 
                div(v-if="applyTomeItem.status===1") 已经给予通过
                div(v-else-if="applyTomeItem.status===2") 已经给予拒绝
                div(v-else)
                    div 
                      textarea(v-model="text",style="width: 80%",placeholder="填写通过或拒绝的理由 (选填)")
                    div(style="margin-top: 5%")
                      button(style="margin-left: 10%",@click="pass(applyTomeItem.rid,text)") 给予通过
                      button(style="margin-left: 10%",@click="reject(applyTomeItem.rid,text)") 给予拒绝
        
</template>
<script>
    import api from '@/api';
    import Vue from 'vue';
    
    export default {

        props: [ 'user' ],
        data() {
            return {
                         show : 1,        // 默认渲染“我的teams”
                    mypublish : [],       // 保存后端查询返回的团队信息（并没有独立的团队信息数据库，而是从召集令中提取）主要是团队成员变化都会变化在召集令的数据库里
                     myapplys : [],       // 保存后端返回的我向别人的申请信息
                    applyToMe : [],       // 保存后端返回的别人向我的申请信息
                         page : 1,
                         text : '',
             isModify_publish : false,    // 是否提出修改发布的召集令
               isModify_apply : false,    //是否提出修改申请
             isRemove_publish : false,    
               isRemove_apply : false,
                         hard : false,     //是否从数据库删除
                           id : '',        //要删除或者的召集令和申请的id
           isModify_pub_start : -1,
        isModify_pub_finished : false,
         isModify_apply_start : false,
      isModify_apply_finished : false,
                    ///////////用于修改召集令时的中间字段
            modified_deadLine : '',
           modified_maxPeople : '',
         modified_peojectName : '',
                  modified_qq : '',
            modified_teamName : '',
         modified_description : '',
                   //////////用于修改申请时的中间字段
   modified_description_apply : '',
            modified_qq_apply : ''
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
                let res = await api.post("/api/team/reply",{rid:rid,text:text,response:true})
                console.log(res.status)
                if(res.status===0){
                    Vue.toasted.show('已通过')
                }
            },
            async reject(rid,text='没有填写理由'){
                let res = await api.post("/api/team/reply",{rid:rid,text:text,response:false})
                console.log(res.status)
                if(res.status===0){
                    Vue.toasted.show('已拒绝')
                }
            },
            publishedData_unixTOnormal(unixtime){
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
            WillmodifyApply(rid){
                this.isModify_apply_start = true;
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
                let res = await api.delete('/api/team', {tid:id,hard});
                if(res.status===0){
                    Vue.toasted.show('删除成功');
                    this.isRemove_publish = false
                };
                this.getMy_published_apply()
            },
            async removeApply(id,hard){   //撤销申请
                let res = await api.delete('/api/team/registration', {rid: id, hard});
                if(res.status===0){
                    Vue.toasted.show('撤销成功');
                    this.isRemove_apply = false
                };
                this.getMy_published_apply()
            },
            async submitModify_pub(tid){
                let putData = {
                            tid,
                             qq : this.modified_qq,
                       teamName : this.modified_teamName,
                    projectName : this.modified_peojectName,
                      maxPeople : this.modified_maxPeople,
                       deadLine : this.modified_deadLine ,
                    description : this.modified_description
                }
                if( this.modified_qq && 
                    this.modified_teamName && 
                    this.modified_peojectName && 
                    this.modified_maxPeople && 
                    this.modified_deadLine &&
                    this.modified_description){
                        let res = await api.put('/api/team',putData);
                        if(res.status===0){
                        }
                    this.getMy_published_apply();
                    this.isModify_pub_start = false;
                    this.modified_qq=this.modified_teamName=this.modified_peojectName=this.modified_maxPeople=this.modified_deadLine=this.modified_description=''
                    }else{
                   Vue.toasted.show('请填写完整')
                    }
            },
            async submitmodifyApply(rid){
                let putData = {
                              rid,
                              qq : this.modified_qq_apply,
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
    color:rgba(74,131,141)
}
h4{
    text-align: center;
    background-color:rgb(226,250,254);
    color:rgba(79,122,125);
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
    color: rgb(74,169,192);
    padding: 1% 2% 1% 2%;
    border-radius: 4px;
    margin-top: 5%
}
.myapply-item{
    background-color: rgba(243,255,255);
    margin: 1% 10% 1% 10%;
    border-radius: 4px;
}
.proj-details{
    background-color: aliceblue;
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
       border-style:solid;
       border-width: 1px;
       color:rgba(74,169,192);
       padding-left: 3%;
       border-radius: 3px
   }
   .block1{
       border-color: rgb(89, 210, 231);
       border-style:solid;
       border-width: 1px;
       color:rgba(74,169,192);
       padding-left: 3%;
       border-radius: 3px
   }
   .key{
       color: rgb(154, 168, 180);
       padding-left: 3%
   }
   .value{
       color: rgba(67,126,136);
       font-size: 110%;
       padding-left: 20%
   }
   #description{
       padding-right: 3%;
       width:93%;
       margin-left:2%
   }
   .applypass{
       color:green
    }
   .appplyreject{
       color:orange
   }
   #remove-dialogue{
    position: fixed;
    z-index: 12;
    top:10%;
    left:10%;
    color:brown;
    font-size: 110%;
    background-color: rgba(27, 118, 134, 0.558);
    border-radius: 5px;
    padding: 6%;
    margin-left: 10%;
    padding-bottom: 1%

   }
   #modify-pub{
    position: fixed;
    z-index: 12;
    top:2%;
    left:14%;
    color:brown;
    padding: 2% 5% 3% 5%;
    background-color: rgba(138, 170, 170, 0.596)
   }
   #modify-apply{
    position: fixed;
    z-index: 12;
    top:2%;
    left:14%;
    color:brown;
    padding: 2% 5% 3% 5%;
    background-color: rgba(138, 170, 170, 0.596)
   }
p.value{
    font-size: 50%
}
.my-publish{
 }
</style>