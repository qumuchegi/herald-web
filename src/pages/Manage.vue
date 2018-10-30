<template>
    <div>
        <div id='tab'>
            <div class= 'tab-item' @click= "show=1">
                我的teams
                <hr v-show= 'show==1' style= "background-color: rgb(5, 66, 46);margin:0;padding: 0"/>
            </div>
            <div class= 'tab-item' @click= "show=2">
                我的召集令
                <hr v-show= 'show==2' style= "background-color: rgb(5, 66, 46);margin:0;padding: 0" />
            </div>
            <div class= 'tab-item' @click= "show=3">
                我的申请
                <hr v-show= 'show==3' style= "background-color: rgb(5, 66, 46);margin:0;padding: 0"/>
            </div>
        </div>
        <div id= 'container'>
            <!--如果已加入一些teams，则在这个容器里面将自己的teams循环渲染出来 -->
            <div v-for= "team of myteams" class= 'my-team' v-if="show==1">
                <div>
                    <h4 class= 'team-project'> {{ team.publishedProj }} </h4>
                    <div class= 'team-info'>
                        <span>
                            <span class= 'team-creator'>队长</span>
                                {{ team.publisherName }}
                        </span>
                        <div class= 'team-members' style= "margin-top:3%">
                            <span class= 'team-member'>组员</span>
                            <span style= "color:rgba(182, 21, 9, 0.671)">{{ team.publisherName }}(队长)</span>
                            <span v-for= "member of team.presentMembers">
                                {{ member }}
                            </span>
                        </div> 
                    </div>
                </div>
                <hr/>
            </div>
            <!--在这个容器里面展示我作为发布者发布召集令后收取到的入队申请消息，具体的内容时申请人填写的个人信息，
            而且针对每一个申请人可以回复消息，另外可以在发布人看完申请人信息后可以一键将他加入team -->
            <div v-for= "team of myteams" v-if= "show==2" style= "background-color: azure">
                <div>
                    <h4 class= 'team-project' style= "background-color: whitesmoke">{{ team.publishedProj }}</h4>
                    <div class= 'team-info'>
                        <span>
                            <span class= 'team-creator'>发布人</span>
                                {{ team.publisherName }}
                            <span class= 'team-creator'>学号</span>
                                {{ team.publisherStunum }}
                            <span class= 'team-creator'>QQ</span>
                                {{ team.publisherQQ }}
                        </span>
                        <div class= 'team-members' style="margin-top:3%">
                            <span class= 'team-member'>组员人数</span>
                            <span>
                                {{ team.presentMembers.length+1 }}/{{ team.membersNum }}
                            </span>
                        </div> 
                        <div style= "margin-top: 4%">
                            <span class= 'publish-details'>召集令说明</span>
                            <p>
                             {{team.publishDetails}}
                            </p>
                        </div>
                        <div v-if="applyToMe.length!==0" style="margin-top: 3%;">
                            <span style= " 
                                        color: rgba(182, 21, 9, 0.671);
                                      padding: 2%;
                                border-radius: 3px;"
                           >申请记录</span>
                            <span v-for= "applyItem of applyToMe" 
                                   v-if= "applyItem.applyTo_WantID===team._id" 
                                  style= "background-color:rgba(182, 26, 62, 0.644);
                                                   padding: 2%;
                                                     color: whitesmoke
                                  "
                                  @click= "looktheApply(applyItem._id)"
                             >
                                {{applyItem.applyFrom_UserName}}
                            </span>
                        </div>
                    </div>
                </div>
                <hr/>
            </div>
           <!--在这个容器里面是我作为申请人收取到发布人回复的内容-->
           <div v-for= "( applywantItem, index ) of myapplys.applyWant" v-if= "show==3 " class= "myapply-item">
            <div>
                <div>
                    <span style= "color: rgb(26, 43, 194)">申请项目</span>
                    <span style= "color: rgb(194, 70, 21);font-size:  120%">{{ applywantItem.publishedProj }}</span>
                </div>
                <div>
                        <span style= "color: rgb(26, 43, 194)">申请状态</span>
                        <span style= "color: rgb(194, 70, 21)"
                        v-if= "myapplys.apply[index].applyStatus !== 'success'">正在申请中……</span>
                        <span style= "color: seagreen"
                        v-if= "myapplys.apply[index].applyStatus === 'success'">申请通过^ _ ^</span>
                </div>
                <div class= "proj-details">
                    <h3>项目详情</h3>
                    <p>
                        <div>
                            <span style= "margin-left: 10%">项目竞赛类别</span>
                            <span>{{ applywantItem.publishedProj }}</span>
                            <div>
                                <span style= "margin-left: 10%">项目负责人</span>
                                <span>{{ applywantItem.publisherName }}</span>
                            </div>
                        </div>
                        <div>
                            <span style= "margin-left: 10%">负责人QQ</span>
                            <span>{{ applywantItem.publisherQQ }}</span>
                        </div>
                    </p>
                </div>
            </div>
            <hr/>
           </div>
       </div>
    </div>
</template>
<script>
    import axios from 'axios';
    import io from 'socket.io-client';

    let socket = io('ws://localhost:9093');
export default {
    props: [ 'user' ],
    created() {
        this.getapplyToMe();   // 获取所有申请我的召集令的申请信息（我是发布者）
        this.getmywant();      // 获取我的发布的过的所有召集令   （我是发布者）
        this.getmyapply();     // 获取我向其他发布者发出的申请信息（我是申请者）
    },
    methods: {
        getapplyToMe() {
            axios.post( 'http://localhost:9093/user/getapplytome', { applyTo: this.user.name } )
            .then( res => {
                if( res.status === 200 && res.data.code === 0 ) {
                    this.applyToMe = res.data.data;
                    console.log( '向我申请的：', this.applyToMe )
                }
            });
            socket.on( 'recapply', function( data ){
                [ this.applyToMe ].push( data );
                console.log( '申请：', this.applyToMe)
            });
        },
        getmywant() {
            axios.post( 'http://localhost:9093/user/getmywant', { publisherName: this.user.name } )
            .then( res => {
                console.log('获取我的want详情:',res.data.data);
                this.myteams = res.data.data;
            })
        },
        looktheApply(applyID) {
            console.log(applyID)
            this.$router.push( {name: '入队申请', params: { applyid: applyID}})
        },
        getmyapply() {
            axios.post( "http://localhost:9093/user/getmyapply", { applyFrom: this.user.name} )
            .then( res => {
                if( res.status === 200 && res.data.code === 0 ){
                    console.log( '我的申请',res.data.data);
                    this.myapplys= res.data.data;
                }
            })
        },
        
    },
    data() {
        return {
               show : 1,        // 默认渲染“我的teams”
            myteams : [],       // 保存后端查询返回的团队信息（并没有独立的团队信息数据库，而是从召集令中提取）主要是团队成员变化都会变化在召集令的数据库里
           myapplys : [],       // 保存后端返回的我向别人的申请信息
          applyToMe : [],       // 保存后端返回的别人向我的申请信息
           
        }
    }
}
</script>
<style scoped>
#tab{
    background-color: rgb(170, 216, 219);
    width:100%;
}
.tab-item{
    display: inline-block;
    margin: 0;
    text-align: center;
    padding: 1% 7% 1% 7%;
    color:rgba(79,122,125);
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
</style>