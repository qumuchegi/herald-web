<template>
    <div>
        <ul id='tab'>
            <li :class="{selected: show===1}" @click= "show=1">
                我的发布
            </li>
            <li :class="{selected: show===2}" @click= "show=2">
                我的申请
            </li>
            <li :class="{selected: show===3}" @click= "show=3">
                接收申请
            </li>
        </ul>

        <div id="remove-dialogue" v-if="isRemove_publish">
           <h3>是否删除此召集令？</h3>
           <button @click="removePublish(id)" style="margin-left: 10%">确认删除</button>
           <button @click="cancelremovePublish(id)" style="margin-left: 5%">取消</button>
        </div>
        <div id="remove-dialogue" v-if="isRemove_apply">
            <h3>是否撤销此申请？</h3>
            <button @click="removeApply(id)" style="margin-left: 10%">确认撤销</button>
            <button @click="cancelremoveApply(id)" style="margin-left: 2%">取消</button>
        </div>
        <div id="modify-pub" v-if="isModify_pub_start">
            <table>
                    <tr  class=''>
                        <span>竞赛类别</span>
                        <input v-model="modified_peojectName" style="width: 80%"/>
                    </tr>
                    <tr  class=''>
                        <span>团队名称</span>
                        <input v-model="modified_teamName" style="width: 80%"/>
                    </tr>
                    <tr v-if='isModify_pub_start' class=''>
                        <span>发起人qq</span>
                        <input v-model="modified_qq" style="width: 80%"/>
                    </tr>
                    <tr v-if='isModify_pub_start' class=''>
                        <span>截止时间</span>
                            <input type='date' v-model="modified_deadLine" style="width: 80%"/>
                    </tr>
                    <tr v-if='isModify_pub_start' class=''>
                        <span>预期招人</span>
                        <input v-model="modified_maxPeople" style="width: 80%"/>
                    </tr>
                    <tr>
                        <p v-if='isModify_pub_start' class=''>
                            <span>组队说明</span>
                            <textarea v-model="modified_description" style="width: 100%;margin-bottom:4%" rows="6"></textarea>
                        </p>
                    </tr>
                    <tr>
                        <span v-if="isModify_pub_start" 
                             style="background-color:rgba(230,249,253);padding: 3%;margin-left: 4%" 
                            @click="cancelmodifyPublish(tid)">取消修改
                  </span>
                  <span v-if="isModify_pub_start" 
                        style="background-color:rgba(230,249,253);padding: 3%;margin-left: 4%" 
                        @click="submitModify_pub(id)">修改完成
                  </span>
                </tr>
                   
            </table>

        </div>
        <div id="modify-apply" v-if="isModify_apply_start">
            <table>
                    <tr >
                        <span>qq</span>
                        <input v-model="modified_qq_apply" style="width:60%"/>
                    </tr>
                    <tr>
                        <span>个人简述</span>
                        <textarea  v-model="modified_description_apply" style="width:100%"></textarea>
                    </tr>
            </table>
            <div style="margin: 3% 5% 2% 15%">
                    <span style="background-color:rgba(230,249,253);padding: 3%" 
                    @click="cancelmodifyApply(id)"
                    v-if="isModify_apply_start">取消修改</span>
               <span style="background-color:rgba(230,249,253);padding: 3%;margin-left: 3%;width:7%" 
                    @click="submitmodifyApply(id)"
                    v-if="isModify_apply_start">完成修改</span>
            </div>
        </div>
        <div id= 'container'>
            <!--如果已加入一些teams，则在这个容器里面将自己的teams循环渲染出来 -->
            <div v-for= "mypublishItem of mypublish" class= 'my-publish' v-if="show==1">
                <span >
                    {{mypublishItem.status===4?"已弃置":"正常"}}
                </span>
                <table>
                            <tr>
                                <td class='block'>
                                    <tr class='key'>竞赛类别</tr>
                                    <tr class='value'> {{ mypublishItem.projectName }}</tr>
                                    
                                 </td>
                                <td class='block'>
                                    <tr class='key'>团队名</tr>
                                    <tr class='value' >{{mypublishItem.teamName}}</tr>
                                    
                                 </td>
                            </tr>
                            <tr>
                                 <td class='block'> 
                                     <tr class='key'>发起人及组员</tr>
                                     <tr class='value'>{{ mypublishItem.masterName }}（发起人）</tr>
                                     <tr class='value' 
                                         v-for="one of mypublishItem.currentPeople" 
                                          v-if="one.name!==mypublishItem.masterName">{{ one.name }}</tr>
                                 </td>
                                 <td class='block'>
                                         <tr class='key'>发起人qq</tr>
                                         <tr class='value'  >{{ mypublishItem.qq }}</tr>
                                         
                                 </td>
                            </tr>
                            <tr>
                                <table>
                                     <td class='block'>
                                             <tr class='key'>发布时间</tr>
                                             <tr class='value'>{{publishedData_unixTOnormal(mypublishItem.publishedDate)}}</tr>
                                         </td>
                                         <td class='block'>
                                              <tr class='key'>截止时间</tr>
                                              <tr class='value'  >{{publishedData_unixTOnormal(mypublishItem.deadLine)}}</tr>
                                              
                                          </td>   
                                </table>
                                <td class='block'>
                                        <tr class='key'>预期招人</tr>
                                        <tr class='value'>{{mypublishItem.maxPeople}}</tr>
                                        
                                </td>
                            </tr>
                    </table>
                    <div id="description">
                            <div class='key'>组队说明</div>
                            <p class='value'>{{mypublishItem.description}}</p>
                            
                    </div>
                    <div style="margin: 5% 20% 5% 27%">
                        <span v-if="!isModify_pub_inished && !isModify_pub_start" 
                             style="background-color:rgba(230,249,253);padding: 3%;margin-left: 4%" 
                            @click="WillmodifyPub(mypublishItem.tid)">修改
                        </span>
                       
                        <span v-if="!isModify_pub_start"
                              style="background-color:rgba(230,249,253);padding: 3%;margin-left: 4%" 
                             @click="willremovePub(mypublishItem.tid)">删除
                        </span>
                    </div>
                <hr/>
            </div>
            <!--在这个容器里面展示我作为发布者发布召集令后收取到的入队申请消息，具体的内容时申请人填写的个人信息，
            而且针对每一个申请人可以回复消息，另外可以在发布人看完申请人信息后可以一键将他加入team -->
            <div v-for= "myapplyItem of myapplys" 
                  v-if= "show==2"  
                :class="[{applypass: myapplyItem.status===1},{appplyreject: myapplyItem.status===2}]">
                    <table>
                            <tr>
                                <td class='block'>
                                    <tr class='key'>申请竞赛类</tr>
                                    <tr class='value'> {{ myapplyItem.projectName }}</tr>
                                 </td>
                                <td class='block'>
                                    <tr class='key'>团队名</tr>
                                    <tr class='value'>{{myapplyItem.teamName}}</tr>
                                 </td>
                            </tr>
                            <tr>
                                 <td class='block'> 
                                     <tr class='key'>发起时间</tr>
                                     <tr class='value'>{{publishedData_unixTOnormal(myapplyItem.updateDate)}}</tr>
                                  </td>
                                 <td class='block'>
                                         <tr class='key'>申请时间</tr>
                                         <tr class='value'>{{publishedData_unixTOnormal(myapplyItem.applicationDate)}}</tr>
                                </td>
                            </tr>
                            <tr>
                                <table>
                                     <td id="description">
                                            <span class='key'>个人简述</span>
                                            <p>{{myapplyItem.description}} </p>
                                           
                                     </td>

                                     <td class='block'>
                                             <tr class='key'>我的qq</tr>
                                             <tr class='value' >{{myapplyItem.qq}}</tr>
                                             
                                     </td> 
                                </table>
                                <td class='block'>
                                        <tr class='key'>申请状态</tr>
                                        <tr class='value'>{{
                                               myapplyItem.status===0 ? '申请当中' : 
                                               myapplyItem.status===1 ? '申请成功' :
                                               myapplyItem.status===2 ? '申请被拒绝' :
                                               null
                                       }}</tr>
                                </td>
                            </tr>
                            <tr>
                                <td class='block'>
                                        <span @click="">团队详情</span>
                                        <span>{{
                                            myapplyItem.status===4?"此团队已经弃置，建议撤销申请":null
                                        
                                        }}</span>
                                </td>
                                <td class='block'>
                                        <tr class='key'>通过或拒绝的理由</tr>
                                        <tr class='value'>{{myapplyItem.responseText}}</tr>
                                </td>  
                            </tr>
                    </table>
                    <div style="margin: 5% 20% 5% 36%" v-if="myapplyItem.status===0"><!-- v-if="myapplyItem.status===0" -->
                            <span style="background-color:rgba(230,249,253);padding: 3%" 
                                 @click="WillmodifyApply(myapplyItem.rid)"
                                  >修改</span>
                            
                            <span style="background-color:rgba(230,249,253);padding: 3%" @click="WillremoveAppl(myapplyItem.rid)">撤销</span>
                    </div>
                <hr/>
            </div>
           <!--在这个容器里面是我作为申请人收取到发布人回复的内容-->
           <div v-for= "applyTomeItem of applyToMe" v-if= "show==3 " class= "applyToMe-item">
               <table>
                   <tr>
                       <td class='block'>
                         <tr class='key'>申请人</tr>
                         <tr class='value'>{{applyTomeItem.applicant}}</tr>
                         <span>申请于{{publishedData_unixTOnormal(applyTomeItem.applicationDate)}}</span>
                       </td>
                       <td class='block'>
                           <tr class='key'>申请人QQ</tr>
                           <tr class='value'>{{applyTomeItem.qq}}</tr>
                       </td>
                   </tr>
                   <tr>
                       <td class='block'>
                           <tr class='key'>申请项目</tr>
                           <tr class='value'>{{applyTomeItem.projectName}}（发布于{{publishedData_unixTOnormal(applyTomeItem.applicationDate)}}）</tr>
                       </td>
                       <td class='block'>
                           <tr class='key'>个人简述</tr>
                           <tr class='value'>{{applyTomeItem.description}}</tr>
                       </td>
                   </tr>
               </table>
               <p>
                <div class='key'>申请处理</div>
                    <div class='value'>
                        <div v-if="applyTomeItem.status===1">已经给予通过</div>
                        <div v-else-if="applyTomeItem.status===2">已经给予拒绝</div>
                        <div v-else>
                            <div>
                                <textarea v-model="text" style="width: 80%" placeholder="填写通过或拒绝的理由 (选填)"></textarea>
                            </div>
                            <div style="margin-top: 5%">
                                <button style="margin-left: 10%" @click="pass(applyTomeItem.rid,text)">给予通过</button>
                                <button style="margin-left: 10%" @click="reject(applyTomeItem.rid,text)">给予拒绝</button>
                            </div>
                        </div>
                    </div>  
               </p>
            <hr/>
           </div>
       </div>
    </div>
</template>
<script>
    import api from '@/api';
    import Vue from 'vue'
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
   isModify_pub_start : false,
isModify_pub_finished : false,
isModify_apply_start : false,
isModify_apply_finished : false,
///////////用于修改召集令时的中间字段
modified_deadLine : '',
modified_maxPeople : '',
modified_peojectName : '',
modified_qq : '',
modified_teamName : '',
modified_description :'',
//////////用于修改申请时的中间字段
modified_description_apply : '',
modified_qq_apply : ''
        }
    },
    created() {
        this.getMy_published_apply();   // 获取所有申请我的召集令的申请信息（我是发布者）
    },
    methods: {
        async getMy_published_apply() {
              console.log('正在请求type=2')
              let res = await api.get('/api/team', {type:2, page:this.page});
              let {published, requested, received} = res;
              console.log('published',published)
              console.log('requested',requested)
              console.log('received',received)
              /*
              published, 我发布的项目
              requested, 我提交的申请
              received,  我收到的申请
              */
              this.mypublish = published;
              this.myapplys = requested;
              this.applyToMe = received;
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
            console.log(typeof(unixtime))
           if(typeof(unixtime)==='string')return unixtime
          let unixTimestamp = new Date(unixtime * 1000)
          let Y = unixTimestamp.getFullYear()
          let M = ((unixTimestamp.getMonth() + 1) > 10 ? (unixTimestamp.getMonth() + 1) : '0' + (unixTimestamp.getMonth() + 1))
          let D = (unixTimestamp.getDate() > 10 ? unixTimestamp.getDate() : '0' + unixTimestamp.getDate())
          let toDay = Y + '-' + M + '-' + D
          return  toDay
        },
         
        willremovePub(tid){
            console.log('要删除召集令',tid);
            this.isRemove_publish = true;
            this.id = tid;
        },
        WillremoveAppl(rid){
            console.log('要删除召集令',rid);
            this.isRemove_apply = true;
            this.id = rid;
        },
        WillmodifyPub(tid){
            console.log('要修改召集令',tid)
            this.isModify_pub_start = true
            this.id = tid;
        },
        WillmodifyApply(rid){
            console.log('要修改申请',rid)
            this.isModify_apply_start = true;
            this.id = rid;

        },
        cancelremovePublish(tid){
            console.log('取消删除',this.id);
            this.isRemove_publish = false;
            this.isModify_pub_start = false
        },
        cancelremoveApply(tid){
            console.log('取消删除',this.id);
            this.isRemove_apply = false
        },
        cancelmodifyPublish(tid){
            console.log('取消修改',this.id)
            this.isModify_pub_start = false

        },
        cancelmodifyApply(rid){
            console.log('取消修改',this.id)
            this.isModify_apply_start = false
        },
        async removePublish(id,hard){   //删除召集令或者申请
            console.log('组队项id',id)
            let res = await api.delete('/api/team', {tid:id,hard:true});
            if(res.status===0){
                console.log('已经从数据库删除');
                Vue.toasted.show('删除成功');
                this.isRemove_publish = false
            };
            this.getMy_published_apply()
        },
        async removeApply(id,hard){
            console.log('申请id',id);
            let res = await api.delete('/api/team/registration', {rid: id, hard:true});
            if(res.status===0){
                console.log('已经从数据库删除');
                Vue.toasted.show('删除成功');
                this.isRemove_apply = false
            };
            this.getMy_published_apply()
        },
        async submitModify_pub(tid){
            console.log('要修改组队项',tid)
            console.log(this.modified_deadLine)
            let putData = {
                tid,
                qq: this.modified_qq,
                teamName: this.modified_teamName,
                projectName: this.modified_peojectName,
                maxPeople: this.modified_maxPeople,
                deadLine: this.modified_deadLine ,
                description:this.modified_description
            }
            console.log('putData',putData)
            if(this.modified_qq && 
               this.modified_teamName && 
               this.modified_peojectName && 
               this.modified_maxPeople && 
               this.modified_deadLine &&
               this.modified_description){
                let res = await api.put('/api/team',putData);
            console.log('res.status',res.status)
            if(res.status===0){
                console.log('修改成功')
            }
            this.getMy_published_apply();
            this.isModify_pub_start = false
               }else{
                   Vue.toasted.show('请填写完整')
               }
    
        },
        async submitmodifyApply(rid){
            let putData = {
                rid,
                qq: this.modified_qq_apply,
                description: this.modified_description_apply
            };
            if(this.modified_qq_apply && this.modified_description_apply){
                let res = await api.put('/api/team/registration', putData);
                if(res.status===0){
                   console.log('修改申请成功')
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
        
        width:100%;

    }
   .block{
       background-color: rgba(226,250,254);
       color:#437e88;
       padding-left: 3%
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
       background-color: rgba(226,250,254);
       padding-right: 3%;
       margin: 0
   }
   .applypass{
       background-color: rgb(49, 187, 84)
   }
   .appplyreject{
       background-color: coral
   }
   #remove-dialogue{
    position: fixed;
    z-index: 12;
    top:10%;
    left:14%;
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

</style>