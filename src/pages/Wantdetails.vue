<template>
    <div>
            <div id = 'want-info'>
                <div>   
                    <span style = "color:rgb(79,175,192)">
                        竞赛
                    </span>
                    <span>
                        {{ wantInfo.publishedProj }}
                    </span>
                    <span style = "color:rgb(79,175,192);margin-left: 10%">
                        目前成员/预期
                    </span>
                    <span style= "margin-left: 3%">
                       {{ wantInfo.presentMembers.length+1}} / {{ wantInfo.membersNum }}
                       <!--由于vue数据绑定，前端可能会先在后端返回查询到的数据前渲染这个length，所以会对这个length报undefined的错-->
                    </span>
                    <div><span style = "color:rgb(79,175,192)">组员</span>
                         <span style ="color:red">{{ wantInfo.publisherName }}(发布人)</span>
                         <span v-for = "member of wantInfo.presentMembers">{{member}}</span>
                    </div>
                    <hr/>
                </div>
                <div>
                    <span style = "color:rgb(79,175,192)">
                        发布人
                    </span>
                    <span>
                        {{ wantInfo.publisherName }}
                    </span>
                    <hr/>
                </div>
                <div>
                    <span style = "color:rgb(79,175,192)">
                        学号
                    </span>
                    <span>
                        {{ wantInfo.publisherStunum }}
                    </span>
                    <span style = "color:rgb(79,175,192);margin-left: 10%">
                        QQ
                    </span>
                    <span>
                        {{ wantInfo.publisherQQ }}
                    </span>
                    <hr/>
                </div>
                <div>
                    <p>
                        <span style = "color:rgb(79,175,192)">召集令说明</span>
                        {{ wantInfo.publishDetails }}
                    </p>
                </div>
            </div>
    </div>
</template>
<script>
    import axios from 'axios'
  export default{
      data() {
          return {
               wantID : '',      // 从URL的参数中获取想要查看的召集令的ID，将会用这个ID在后端数据库查询这个召集令的详情
             wantInfo : []       // 保存查询反悔的召集令的信息
          }
      },
      created() {
        this.wantID = this.$route.params.wantid;
        axios.post( 'http://localhost:9093/user/getthewant', { wantID : this.wantID } )
        .then( res=>{
            if( res.status=== 200 && res.data.code=== 0){
                       console.log('获取want详情:', res.data.data);
                       this.wantInfo= res.data.data[0];
                   }
        })
      }

  }
</script>
<style scoped>
#want-info{
    padding: 5% 20% 20% 20%
}
</style>