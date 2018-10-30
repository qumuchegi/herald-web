const mongoose = require( 'mongoose' );
const    DBURL = 'mongodb://localhost:27017/zudui';
mongoose.connect( DBURL, { useNewUrlParser : true }, err=>console.log(err) );

//用户信息的model
mongoose.model( 'wants',                              //用于保存发起者发布的召集令（want 招聘）
               new mongoose.Schema( {
                       publisherName : String,             //发布人姓名
                     publisherStunum : String,             //发布人学号
                         publisherQQ : String,             //发布人QQ
                       publishedProj : String,             //所报竞赛
                          membersNum : Number,             //预计队员人数
                   presentMembersNum : Number,             //目前人数
                      presentMembers : Array,              //目前成员名字
                      publishDetails : String              //发布说明
               } )

);
mongoose.model( 'apply',                              //用于保存申请者发出申请的信息(apply 申请)
                new mongoose.Schema( {
                      applyTo_WantID : String,            //申请人所申请的召集令在mongoDB数据库里的ID
                    applyTo_UserName : String,            //所申请召集令的发布者（申请目标）的名字
                  applyFrom_UserName : String,            //申请者（申请来源）的名字
                        applyFrom_QQ : String,            //申请者的QQ
                     applyFrom_Phone : String,            //申请者的手机号码
                         applyStatus : String             //申请状态（正在申请中/申请被召集令发布者予以通过）
                } )

)
 
module.exports = {
    getmodel : function( model ){
        return mongoose.model( model )
    }
}