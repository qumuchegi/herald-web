<template lang = 'pug'>
    div#body
      table 
        tr 
          td.block
            tr.key 竞赛类别
            tr.value {{ wantInfo.projectName }}
          td.block 
            tr.key 团队名
            tr.value {{wantInfo.teamName}}
        tr 
          td.block 
            tr.key 发起人及组员
            tr.value {{ wantInfo.masterName }}（发起人）
            tr.value(v-if = "one.name!==wantInfo.masterName",v-for = "one of wantInfo.currentPeople") {{ one.name }}
          td.block 
            tr.key 发起人qq
            tr.value {{ wantInfo.QQ }}
        tr 
          table 
            td.block 
              tr.key 发布时间
              tr.value {{ unixTOnormal(wantInfo.publishTime)}}
            td.block 
              tr.key 截止时间
              tr.value {{ unixTOnormal(wantInfo.endTime)}}
          td.block 
              tr.key 预期招人
              tr.value {{wantInfo.maxPeople}}
      #description 
        .key 组队说明
        .value {{wantInfo.description}}
      hr(style="margin: 1%")
      #apply-container(v-if="!hasApplied")
        span(style = "font-size:120%;margin-left: 40%;color:rgb(73, 187, 207)") 申请组队
        div 
          input(placeholder = "您的qq",style="width: 100%",v-model="myqq")
        hr(style="margin: 2%")
        div 
          textarea(placeholder="个人简述",rows="5",cols="30",style="width:100%",v-model="myapplytext")
        button(@click="applyJion",style="margin: 10% 25% 2% 40%") 确认申请
      #applied-warn(v-else)
          span 已经申请此组队

</template>
<script>
    import api from '@/api'
    import Vue from 'vue'
  
    export default{
      data() {
          return {
               wantID : '',      // 从URL的参数中获取想要查看的召集令的ID，将会用这个ID在后端数据库查询这个召集令的详情
             wantInfo : {},       // 保存查询反悔的召集令的信息
                 myqq : '',
          myapplytext : '',
           hasApplied : false
          }
      },
      created() {
        this.wantID = this.$route.params.wantid;
        this.getWant(this.wantID);
        this.Applied()
      },
      methods: {
          async getWant(tid){
            let postData= { type:3,  page:1, param:JSON.stringify({tid: this.wantID})  };
            let res = await api.get('/api/team',postData);
            this.wantInfo = res.data[0];
          },
          async Applied(){ 
            let res = await api.get('/api/team', {type:2,page:1});
            let {requested} = res;
            requested.map(ele => {
                ele.tid===this.wantID && ele.status!==3 && ele.status!==2? this.hasApplied=true : null;
            });
          },
        unixTOnormal(unixtime){
            if(typeof(unixtime)==='string')return unixtime;
            let unixTimestamp = new Date(unixtime * 1000);
            let Y = unixTimestamp.getFullYear();
            let M = ((unixTimestamp.getMonth() + 1) > 10 ? 
                   (unixTimestamp.getMonth() + 1) : '0' + (unixTimestamp.getMonth() + 1));
            let D = (unixTimestamp.getDate() > 10 ? unixTimestamp.getDate() : '0' + unixTimestamp.getDate());
            let toDay = Y + '-' + M + '-' + D;
            return  toDay;
          },
          async applyJion(){
            if(this.myapplytext && this.myqq){
                let res = await api.post('/api/team/registration', 
                { 
                    tid:this.wantInfo.tid,
                    qq:this.myqq ,
                    description:this.myapplytext 
                });
                res.status===0?Vue.toasted.show('已经发出申请'):Vue.toasted.show('重复申请')
            }else{
                Vue.toasted.show('请填写完整')
            }
          }
      }

  }
</script>
<style scoped>
    #body{
        background-color: white;
        margin-top: 2%
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
       padding-right: 5%
   }
   #apply-container{
       margin: 5% 10% 5% 10%
   }
   #applied-warn{
       color:rgb(154, 168, 180);
       padding: 5% 10% 1% 35%
   }
</style>