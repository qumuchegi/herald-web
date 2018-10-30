<template>
<div id='body'>
      <span id= 'search-team'   @click= "clickToSearch(isQuery)">
          搜team
      </span>
      <span id= 'call-member'   @click= "clickToFindMate">
          招队员
      </span>
      <span id= 'my-manage'   @click= "clickToManage">
          我的
      </span>
      <p v-if= 'isQuery'   id= 'query-input'>
          <input v-model= 'queryStr'   placeholder= "输入竞赛名  如 北斗杯"/>
          <button @click= "clickToQuery">
              搜索
          </button>
          <button @click= 'cancelQuery'>
              取消
          </button>
        </p>
      <div v-for= "Ad in wantAd"   :key= "Ad.id"   id= 'want-ad'>
          <div id= 'want-project'>
             {{ Ad.publishedProj }}
          </div> 
          <div style= "display: inline-block; padding: 2% 2% 3% 2%">
            <div id= 'present-members'>
                    <span style= 'background-color : rgba(102,102,102);
                                             color : aliceblue;
                                     border-radius : 2px 0 0px 2px'>
                        目前组员
                    </span>
                    <span style= 'background-color : rgb(71,137,174);
                                             color : white'>
                            {{ Ad.presentMembers.length+1 }}/{{ Ad.membersNum }}
                    </span>
            </div>
            <div id= 'want-publisher'>
                    <span style= 'background-color :rgba(102,102,102);
                                             color : aliceblue;
                                     border-radius : 2px'>
                        发布人
                    </span>
                    <span style= 'background-color : rgb(125,214,105);
                                             color :white'>
                            {{ Ad.publisherName }}
                    </span>
            </div>
      </div>
      <button style= 'float: right; margin-right: 2%'   @click= "clickToDetails(Ad._id)">
          详情
      </button>
      <button style= 'float: right;'  id = 'apply-button'  @click= "isapplyJoin(Ad._id,Ad.publisherName)">
          <span>申请加入</span>
      </button>
      <span v-if= "isapply" id= 'hasapplyed-warn'>
            <span style= "margin-left: 9%; color:rgb(66, 29, 201)">
                填写申请表以便于对方联系你
            </span>
            <div>
                  <span>你的QQ</span><input style= "margin-left: 2.7%" v-model= "applyFrom_QQ"/>
                  <hr style= "margin: 1%"/>
                  <span>你的手机</span><input v-model= "applyFrom_Phone"/>
            </div>
            <hr style= "margin: 2%"/>
          <button @click= 'applyJoin(applyWant_ID, applyTo_user)' 
                 style= "font-size : 120%; 
                             color :deepskyblue;
                           padding : 1% 20% 1% 20%;
                       margin-left : 4%;
                        margin-top : 3%;
                      "
                     >
                     确认申请
          </button>
          <button @click= "isapply= false"
                 style= "font-size : 120%; 
                             color :deepskyblue;
                        margin-top : 3%;
                      ">
              取消
          </button>
        </span>
      </div>
</div>
</template>

<script>
import axios from 'axios';
import io from 'socket.io-client';

let socket = io( 'ws://localhost:9093' );
export default {
    props: [ 'user' ],
    created() {
        this.getAllWants();
    },
    data() {
        return {
               isQuery : false,   // 搜索框是否渲染的状态，false默认不渲染
              queryStr : '',      // 获取搜索框input 的项目名称
                wantAd : [],      // post请求到后端所有的召集令后存到这个数组中用于将其列表渲染出来
               isapply : false,   // 是否申请，申请中点击 “申请加入” 后唤出申请者信息的填写表单，这个 isapply 决定是否渲染这个表单
            hasapplyed : false,   // 提交申请表单后socket会将申请信息同时发送给召集令的发布者和保存到后端的数据库，如果这个操作过程成功则这个hasapply为true
          applyWant_ID : '',      // 用于在已经渲染出来的召集令列表中获取某一个召集令在数据库的ID，在“确认申请”后用这个ID创建一个申请信息
                                  // 也就是把这个ID当作这条申请信息的一个字段，（这个ID就把申请者和这个召集令联系起来了），
                                  // 以后申请者通过这个ID可以查询到自己申请了哪些召集令及该召集令的动态信息（如新增了哪些成员）
          applyTo_user : '',      // 申请目标（即召集令的发布者）的，名字
          applyFrom_QQ : '',      // 申请者的QQ
       applyFrom_Phone : '',      // 申请者的手机
        }
    },
    computed: {
        
        },
    methods: {
        getAllWants() {
        axios.post( 'http://localhost:9093/user/getallwants' )
        .then( res => {
            if( res.status === 200 && res.data.code === 0) {
                       console.log( '获取所有wants:', res.data.data );
                       this.wantAd = res.data.data;
                   }
        })
        },
        clickToSearch() {
            this.isQuery = !this.isQuery;
        },
        cancelQuery() {
            this.getAllWants();
            this.isQuery = false;
        },
        clickToFindMate() {
            this.$router.push( { path: '/callmember' } );
        },
        clickToManage() {
            this.$router.push( { path: '/manage' } );
        },
        clickToDetails(id) {
            this.$router.push( { name: '召集令详情', params: { wantid:id } } )
        },
        clickToQuery() {
            this.queryStr === '' ? alert('请输入搜索竞赛')
            :
            axios.post( 'http://localhost:9093/user/querywant', { publishedProj:this.queryStr } )
            .then( res => {
                if( res.status === 200 && res.data.code === 0 ) {
                    console.log( '搜索结果', res.data.data );
                    this.wantAd = res.data.data;
                } else {
                    alert(res.data.data)
                }
            })
        },
        isapplyJoin(applyWant_ID,applyTo_user) {//唤起申请需要填写的表单，在表单填写完确定后才会真正发送申请
            console.log( '申请加入', this.user.name )
            this.isapply = true;
            this.applyWant_ID = applyWant_ID;
            this.applyTo_user = applyTo_user
        }
        ,
        applyJoin( id, applyTo_user) {
            var that = this;
            console.log('申请：',id, applyTo_user)
            if( this.applyFrom_Phone && this.applyFrom_QQ ) 
            {
                console.log('申请表信息：',this.applyFrom_Phone)
            socket.emit( 'sendapply' , { 
                id:id, 
                       apply_To : applyTo_user, 
                     apply_from : this.user.name ,
                   applyFrom_QQ : this.applyFrom_QQ,
                applyFrom_Phone : this.applyFrom_Phone
            } );
            socket.on( 'recapply', function(data){
                data.applyTo_WantID === id && data.applyFrom_UserName === that.user.name ? 
                (that.hasapplyed= true): null
            });
            this.isapply = false;
            }
            else
            alert('请填写完整');   
        }

    }
}
</script>

<style scoped>
#body{
    background-color: white
}
#hasapplyed-warn{
    position: fixed;
    z-index: 12;
    top:30%;
    left:14%;
    color:brown;
    font-size: 110%;
    background-color: rgba(138, 226, 164, 0.158);
    border-radius: 5px;
    padding: 6%;
    padding-bottom: 1%
}
#search-team{
    display: inline-block;
    background-color:rgba(226,250,254);
    margin-top: 1%;
    padding: 3% 10% 3% 10%;
    margin-left:2%;
    border-radius: 1px;
    color:rgb(62,121,124)
}
#call-member{
    display: inline-block;
    background-color: rgba(226,250,254);
    margin-top: 1%;
    padding: 3% 11% 3% 11%;
    border-radius: 2px;
    color:rgb(62,121,124)
}
#my-manage{
    display: inline-block;
    background-color: rgba(226,250,254);
    margin-top: 1%;
    padding: 3% 12% 3% 13%;
    border-radius: 2px;   
    color:rgb(62,121,124)
}
#want-ad{
    border-radius: 3px;
    background-color: rgba(132, 224, 240, 0.589);
    margin: 2% 
}
#want-project{
    
    color:rgb(36, 110, 116);
    
    border-radius: 3px;
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
