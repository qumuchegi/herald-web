<template>
    <div>
            <h2>填写召集令</h2>
            <div id= "call-form">
              <div>
                  <span style = "color: rgb(74,169,192)">发布人</span>
                  <input placeholder= "发布人全名" id= "publisher-name" v-model= 'publisherName'/>
              </div>
              <hr/>
              <div>
                  <span style = "color: rgb(74,169,192)">学号</span>
                  <input placeholder= "发布人学号" id= "publisher-stunumber" v-model= 'publisherStunum'/>
              </div>
              <hr/>
              <div>
                  <span style = "color: rgb(74,169,192)">QQ</span>
                  <input placeholder= "发布人QQ,用于后续联系" id= "publisher-QQ" v-model= 'publisherQQ'/>
              </div>
              <hr/>
              <div>
                  <span style = "color: rgb(74,169,192)">竞赛</span>
                  <input placeholder= "北斗杯 结构竞赛 srtp  ......" id= "publisher-comptation" v-model= 'publishedProj'/>
              </div>
              <hr/>
              <div>
                  <span style = "color: rgb(74,169,192)">预计队员人数</span>
                  <input placeholder= ">=1" id= "publisher-num" v-model= 'membersNum'/>
              </div>
              <hr/>
              <div>
                  <span style = "color: rgb(74,169,192)">组队说明</span>
                  <textarea id = "publisher-more" 
                   placeholder = "队员结构  招人条件 组队后分工安排 等......." 
                       v-model = 'publishDetails'
                          rows = "10"
                          cols = "25"
                  >

                  </textarea>
              </div>
            </div>
            <button  @click= "publishWantAd" id= 'publish-button'>
            发布
            </button>
            <div v-if= "isPublished" style= "text-align : center;
                                                 margin : 2% 20% 2% 20%;
                                                  color : rgb(62,121,124);
                                                 border : radius 3px;
                                              font-size : 130%"
            >
             已发布  请返回搜索即可查看
            </div>
    </div>
</template>
<script>
    import axios from 'axios'
    import Vue from 'vue'
    export default {
        data() {
           return {
              publisherName : '',
            publisherStunum : '',
                publisherQQ : '',
              publishedProj : '',
                 membersNum : '',
             publishDetails : '',
                isPublished : false  //后端有无保存成功召集令
           }
       },
       created() {

       },
       methods: {
           publishWantAd() { //向后端发送填好的召集令信息，后端接受后会保存
               console.log( this.publisherName );
               console.log("publishDetails",this.publishDetails)
               axios.post( 'http://localhost:9093/user/publishwant',
               {
                     publisherName : this.publisherName,
                   publisherStunum : this.publisherStunum,
                       publisherQQ : this.publisherQQ,
                     publishedProj : this.publishedProj,
                        membersNum : this.membersNum,
                    publishDetails : this.publishDetails
               }
               ).then( res => {
                   if(res.status=== 200 && res.data.code=== 0){
                       this.isPublished= true;
                   }
               })
           }
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
</style>