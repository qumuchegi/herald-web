<template>
    <!--展示申请人信息-->
    <div style= "margin: 20% 30% 20% 18%" >
            <div>
                <span style= "font-size: 120%;color:rgb(14, 214, 181)">申请人</span>
                <span>{{apply.applyFrom_UserName}}</span>    
            </div>
            <hr/>
            <div>
                <span style= "font-size: 120%;color:rgb(14, 214, 181)">申请人QQ</span>
                <span>{{apply.applyFrom_QQ}}</span>
            </div>
            <hr/>
            <div>
                <span style= "font-size: 120%;color:rgb(14, 214, 181)">申请人手机</span>
                <span>{{apply.applyFrom_Phone}}</span>
            </div>
            <hr/>
            <div>
                 <button 
                 v-if= "!isapplypassed"
                 @click= "passApply( apply.applyFrom_UserName, apply.applyTo_WantID )">
                     通过他的申请并将他加入我的team
                </button>
                <div v-if= "isapplypassed">
                    此申请已经给予通过
                </div>
            </div>
            <hr/>
    </div>
</template>
<script>
    import axios from 'axios';
    import io from 'socket.io-client';

    let socket = io( 'ws://localhost:9093' ); 
    export default {
        props: ['user'],
        data() {
            return {
                want_applied: '',
                apply:'',
                applyID:'',
                isapplypassed:false,
            }

        },
        created() {
            this.getapply();
           // this.getwantPassInfo_fortheID();
            
        },
        methods: {
            getapply() {
                this.applyID= this.$route.params.applyid;
                axios.post( 'http://localhost:9093/user/getapplyfrom',{ applyID: this.applyID})
                .then( res => {
                    if( res.status === 200 && res.data.code === 0 ) {
                      this.apply= res.data.data;
                      if(res.data.data.applyStatus === 'success'){
                            this.isapplypassed = true;
                        }
                   }
                });
            },
            passApply( applayer, applywantID) {
                let that = this;
                socket.emit( 'sendpass', { passapplayer: applayer, wantID: applywantID });
                socket.on( 'recpass', function( data ){
                    const { applyStatus } = data;
                    console.log(applyStatus)
                    if ( applyStatus == 'success') {
                        that.isapplypassed = true;
                    }
                })
            }

        },


    }
</script>
<style scoped>
    h3{
        text-align: center;
        color:  rgb(33, 133, 124)
    }
</style>