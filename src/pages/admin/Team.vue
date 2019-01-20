<template lang='pug'>
    .admin-page#team 
        #search
          input(v-model="querystring",placeholder="输入组队发起人一卡通")
          button(@click="queryWants") 搜索
        #turn-page 
          span#last-page(v-if= "page > 1",@click= "getLastPage") 上一页
          span(v-if= "page===1",style="color: white") 占位符
          span(style="margin-left: 28.5%") 第{{page}}页
          span#next-page(v-if= "newWants.length===6",@click= "getNextPage" ) 下一页
        div 
         span.newTitle {{newWants.length}}条组队项
         ul#new(v-for="(item,index) of newWants")
          li.want-item
            table
             tr
              table
                td.block
                  tr.key 发布人
                  tr.value {{item.masterName}} 
                td.block
                  tr.key 一卡通
                  tr.value {{item.cardnum}} 
                td.block 
                  tr.key qq
                  tr.value {{item.qq}}
             tr 
                table
                 tr
                  td.block
                    tr.key 竞赛类
                    tr.value {{item.projectName}}
                  td.block
                    tr.key 团队名
                    tr.value {{item.teamName}}
                  td.block 
                    tr.key 预期人数
                    tr.value {{item.maxPeople}}
                  td.block 
                    tr.key 当前人数
                    tr.value {{item.currentPeople.length}}
             tr 
               table
                td.block
                  tr.key 发布时间
                  tr.value {{now.D-unixtimeTonormal(item.publishedDate).D}}天前
                td.block 
                  tr.key 截止时间
                  tr.value {{unixtimeTonormal(item.deadLine).ymd}}  
            .key 组队说明
                p.value {{item.description}}
          textarea(v-model="reason",v-if="willremove===index",placeholder="删除理由") 
          div.buttons  
            button.remove(@click="willremove=index",v-if="willremove!==index") 删除
            button(@click="adminRemove(item.tid)",v-if="willremove===index") 确定删除
            button(@click="willremove=-1",v-if="willremove===index") 取消
</template>
<script>
    import api from '@/api'
    import Vue from 'vue'

    export default{
        data(){
            return{
                page : 1,
                newWants: [],
                now:{},
                querystring:'',
                willremove:-1,
                reason:'',
                type:''
            }
        },
        created(){
            this.type=1;
            let now = new Date();
            this.now.Y = now.getFullYear();
            this.now.M = now.getMonth();
            this.now.D = now.getDate();
            this.getnewWants();
            console.log(this.now)
        },
        methods:{
            async getnewWants(){
                let res = await api.get('/api/team', { type:this.type, page:this.page});
                let allWants = res.data;
                console.log('allWants',allWants)
                this.newWants = allWants.filter(item=>this.istimeNew(item.publishedDate))
                console.log('newWants',this.newWants)
            },
            async queryWants(){
                this.type=3
                if(this.queryWants){
                    let res = await api.get('/api/team',{ type:this.type,page:this.page,param: JSON.stringify({cardnum:this.querystring})});
                    this.newWants = res.data;
                    console.log('搜索结果：',this.newWants)
                }
                
            },
            unixtimeTonormal(unixtime){
                if(typeof(unixtime)==='string') {
                    let arr=unixtime.split('-');
                    return {Y:arr[0],M:arr[1],D:arr[2],ymd:unixtime}
                }
                let unixTimestamp = new Date(unixtime * 1000);
                let Y = unixTimestamp.getFullYear();
                let M = ((unixTimestamp.getMonth() + 1) > 10 ? 
                         (unixTimestamp.getMonth() + 1) : 
                         '0' + (unixTimestamp.getMonth() + 1));
                let D = (unixTimestamp.getDate() > 10 ? 
                         unixTimestamp.getDate() : 
                         '0' + unixTimestamp.getDate());
                return {Y,M,D,ymd:`${Y}-${M}-${D}`};
            },
            istimeNew(unixtime){//判断是否是新want标准是距离天数<1
                let {Y,M,D} = this.unixtimeTonormal(unixtime);
                return (this.now.Y > Y) ? (this.now.M > M ? false : (12-M)>=1 ? false : (31-D+(this.now.M-1)*31+this.now.D)>1 ? false:true)
                                        : this.now.M > M ? (31-D+(this.now.M-1)*31+this.now.D)>1 ? false:true 
                                        : this.now.D-D > 1 ? false : true
            },
            async adminRemove(tid){
                if(!this.reason) return Vue.toasted.show('请填写管理员删除理由')
                let res = await api.delete('/api/team',{tid,hard:false,msg:this.reason})
                if(res.status===0){
                    Vue.toasted.show('只增加状态，不给以展示');
                    this.getnewWants()
                }
            },
            getNextPage(){
                this.page++;
                if(this.type === 1){
                    this.getnewWants()
                }else{
                    this.queryWants()
                }
               
            },
            getLastPage(){
                this.page--;
                if(this.type===1){
                    this.getnewWants()
                }else{
                    this.queryWants()
                }
               
        },

        },
    }
</script>
<style scoped>
    ul{
         padding: 1% ;
         background-color: rgb(226,250,254)
    }
.want-item{
    padding: 2% 5% 2% 5%;
    display: inline;
}
table{
    width: 100%
}
.block{
       background-color: white;
       color:rgba(74,169,192);
       padding-left: 3%
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
.buttons{
    margin-left: 5%;
    padding: 2%

}
#search input{
    margin-left: 16%
}
textarea{
    width:100%
}
#turn-page{
    margin-left: 10%;
    margin: 2% 10% 2% 10%
}
#next-page{
    float: right;
    margin-right: 10%;
}
</style>