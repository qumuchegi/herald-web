<template>
    <div>
       <table>
           <tr>
               <td class='block'>
                   <tr class='key'>竞赛类别</tr>
                   <tr class='value'> {{ wantInfo.projectName }}</tr>
                </td>
               <td class='block'>
                   <tr class='key'>团队名</tr>
                   <tr class='value'>{{wantInfo.teamName}}</tr>
                </td>
           </tr>
           <tr>
                <td class='block'> 
                    <tr class='key'>发起人及组员</tr>
                    <tr class='value'>{{ wantInfo.masterName }}（发起人）</tr>
                    <tr class='value' v-for="one of wantInfo.currentPeople" v-if="one.name!==wantInfo.masterName">{{ one.name }}</tr>
                </td>
                <td class='block'>
                        <tr class='key'>发起人qq</tr>
                        <tr class='value'>{{ wantInfo.qq }}</tr>
               </td>
           </tr>
           <tr>
               <table>
                    <td class='block'>
                            <tr class='key'>发布时间</tr>
                            <tr class='value'>{{publishedData_unixTOnormal(wantInfo.publishedDate)}}</tr>
                        </td>
                        <td class='block'>
                             <tr class='key'>截止时间</tr>
                             <tr class='value'>{{publishedData_unixTOnormal(wantInfo.deadLine)}}</tr>
                         </td>   
               </table>
               <td class='block'>
                    <tr class='key'>预期招人</tr>
                    <tr class='value'>{{wantInfo.maxPeople}}</tr>
               </td>
           </tr>
       </table>
       <div id="description">
           <div class='key'>组队说明</div>
           <p class='value'>{{wantInfo.description}}</p>
       </div>
       <hr style="margin: 1%"/>
       <div id="apply-container">
           <span style="font-size:120%;margin-left: 40%;color:rgb(73, 187, 207)">申请组队</span>
           <div><input placeholder="您的qq" style="width: 100%" v-model="myqq"/></div>
           <hr style="margin: 2%"/>
           <div>
               <textarea placeholder="个人简述" rows="5" cols="30" style="width:100%" v-model="myapplytext"></textarea>
           </div>
           <button @click="applyJion" style="margin: 10% 25% 2% 40%">确认申请</button>
       </div>
    </div>
</template>
<script>
    import api from '@/api'
    import Vue from 'vue'
  export default{
      data() {
          return {
               wantID : '',      // 从URL的参数中获取想要查看的召集令的ID，将会用这个ID在后端数据库查询这个召集令的详情
             wantInfo :{},       // 保存查询反悔的召集令的信息
             myqq:'',
             myapplytext:''
          }
      },
      created() {
        this.wantID = this.$route.params.wantid;
        console.log('tid',this.wantID)
        this.getWant(this.wantID);
        
      },
      methods: {
          async getWant(tid){
            let postData= { type:3,  page:1, param:JSON.stringify({tid: this.wantID})  };
            let res = await api.get('/api/team',postData);
            this.wantInfo = res.data[0];
            console.log('res.data',this.wantInfo)
          },
          publishedData_unixTOnormal(unixtime){
          let unixTimestamp = new Date(unixtime * 1000)
          let Y = unixTimestamp.getFullYear()
          let M = ((unixTimestamp.getMonth() + 1) > 10 ? (unixTimestamp.getMonth() + 1) : '0' + (unixTimestamp.getMonth() + 1))
          let D = (unixTimestamp.getDate() > 10 ? unixTimestamp.getDate() : '0' + unixTimestamp.getDate())
          let toDay = Y + '-' + M + '-' + D
          return  toDay
        },
        async applyJion(){
            if(this.myapplytext && this.myqq){
                console.log(this.myapplytext,this.myqq)
                let res = await api.post('/api/team/registration', 
                { 
                    tid:this.wantInfo.tid,
                    qq:this.myqq ,
                    description:this.myapplytext 
                });
                res.status===0?Vue.toasted.show('已经发出申请'):Vue.toasted.show('重复申请')
                console.log('申请res:',res)
            }else{
                Vue.toasted.show('请填写完整')
            }
        }
      }

  }
</script>
<style scoped>
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
       padding-right: 5%
   }
   #apply-container{
       margin: 5% 10% 5% 10%
   }
</style>