const    express = require ( 'express' );
const     Router = express.Router ();
const        app = express ();
const     server = require ( 'http' ) . Server ( app );
const         io = require('socket.io') ( server );
const      model = require ( './mongodb' );
const bodyParser = require ( 'body-parser' );
app.use ( bodyParser.json() );

let wantsInfo = model.getmodel ( 'wants' );
let applyInfo = model.getmodel ( 'apply' );

//以下get都是为了前端查看数据库调试用的
Router.get( '/getpublishwant' , function( req, res ) {
    wantsInfo.find( {}, function(err, dat) {
        res.json( dat )
    } )
});
Router.get( '/getapply', function(req,res){
    applyInfo.find( {}, function(err,dat){
        res.json(dat)
    })
});

//下面这段路由处理代码用于响应前端发布召集令时将召集令保存到数据库
Router.post( '/publishwant' , function( req, res ) {
    const {
            publisherName,
            publisherStunum,
            publisherQQ,
            publishedProj,
            membersNum,
            publishDetails
          } = req.body;
    new wantsInfo( 
        {
            publisherName,
            publisherStunum,
            publisherQQ,
            publishedProj,
            membersNum,
            publishDetails
        }
    ).save();
    return res.json( {code:0, data:'已经保存召集令！'} )
});

//下面这段代码用于组队功能首页需要展示所有的召集令时将数据库里所有召集令信息发送给前端
Router.post( '/getallwants' , function( req, res ){
    wantsInfo.find( {}, function(err,dat){
        res.json({code:0,data:dat})
    } )
})

//下面这段代码用于前端用户（申请者）查看召集令详情时将某一个召集令的信息发送给前端
Router.post( '/getthewant' , function( req, res ){
    const { wantID } = req.body;
    wantsInfo.find( { _id: wantID }, function( err, dat ){
        res.json( { code:0, data:dat } )
    })
});

//下面这段代码用于发布者查询自己的召集令，其实可以和上面那个getthewant合并复用的
Router.post( '/getmywant', function( req, res ){
    const { publisherName } = req.body;
    wantsInfo.find( {  publisherName }, function( err, dat ){
        res.json( { code:0, data:dat } )
    })
});
 
//下面这段代码用于申请中查询自己以及发送给召集令发布者的申请信息，因为要同时查询申请信息和所申请的召集令
Router.post( '/getmyapply', function( req, res ){
    const { applyFrom } = req.body;   //申请来源即申请者
    let jsonback={    //这里用一个对象保存从数据库查询到的申请者申请的信息和所申请的召集令的信息
        apply:[],     //申请信息
        applyWant:[]   //所申请的召集令的信息
    };
    let i=0;                    // i 是一个计数器

    // 由于前端Vue数据绑定，服务器查询数据是异步的，所以Vue在渲染时可能没有得到数据就渲染时就会报错，所以在这里
    //用一个计数变量器来判断异步查询数据的完整性，若这个计数器等于数据的长度才会吧查询到的数据发送给前端让vue渲染出来

    applyInfo.find( { applyFrom_UserName: applyFrom }, function( err, dat ){
        if(dat) {
            jsonback.apply= dat;                        //申请者所申请的所有信息，包括所申请的所有项目，这里有待优化以减少数据库冗余
            dat.forEach( ( applyWantItem, index ) => {  //dat 里每一条数据里有一个对应的召集令的ID，所以由这个ID查询对应的召集令
                wantsInfo.findOne( { _id: applyWantItem.applyTo_WantID }, function( err, data ){
                    i++;            //随着mongoose每次查询完一条数据（一条数据代表申请中所申请的一个召集令），计数器递增
                    if(data) {
                        jsonback.applyWant[index] = data ;
                        console.log('applywant',index,jsonback.applyWant[index])
                    }else{
                        console.log('找不到')
                    };
                   
                    if( i === dat.length ){  //计数器等于申请的总召集令数时将查询到的全部数据发送给前端
                        res.json( { code:0, data:jsonback } )
                    }
                })
            })
        }
    })
});

//在组队功能首页里搜索项目（srtp/北斗杯。。。。)时查询用户键入的项目并返回
Router.post( '/querywant', function(req,res){
    const { publishedProj } = req.body;
    wantsInfo.find( { publishedProj }, function(err,dat){
        if( !dat ){
            return res.json( { code:1, data:'查询暂无此竞赛的召集令' } )
        }
        else return res.json( { code:0, data:dat } )
    })
});

//下面这段代码用于给发布召集令的发布者发送申请者对其召集令的申请信息，发布者可以看到有哪些人对其召集令发出了申请
Router.post( '/getapplytome', function( req, res ){
    const { applyTo } = req.body;
    applyInfo.find( { applyTo_UserName : applyTo }, function( err, dat ){
        if( dat ){
            return res.json( { code:0, data:dat } )
        }
    })
});

//下面这段代码是用于发布者查看自己召集令中的申请者的申请通过状态的，
//（发布者给予申请者通过后申请者的申请信息中的申请状态变为申请成功，
//这段代码就是查询这个申请状态的，然后发布者就可以在后面查看这个人的申请记录时就可以知道他的申请状态了
Router.post( '/getapplyfrom', function( req,res ){
    const {applyID} = req.body;
    applyInfo.findOne( { _id: applyID }, function( err, data ){
        if(data){
            res.json( { code:0, data: data })
        }
    })
})

//用 socket.io 让发布者通过申请中的申请后实时将申请状态发送给申请者
io.on( 'connection', function( socket ){
    socket.on( 'sendapply', function( data ){
        const { id, apply_To, apply_from, applyFrom_QQ, applyFrom_Phone } = data;
        applyInfo.findOne( { applyTo_WantID:id , applyFrom_UserName:apply_from } , function( err, dat ){
            if( !dat ){
                new applyInfo({
                    applyTo_WantID : id,
                    applyTo_UserName : apply_To,
                    applyFrom_UserName : apply_from,
                    applyFrom_QQ,
                    applyFrom_Phone,
                    applyStatus:''
                }).save();
                io.emit( 'recapply' , 
                { 
                    applyTo_WantID: id , 
                  applyTo_UserName: apply_To , 
                applyFrom_UserName: apply_from ,
                      applyFrom_QQ,
                   applyFrom_Phone,
               } )
            } else {
                return console.log('已经有相同申请')
            }
        })
    });
    socket.on( 'sendpass', function( data ){
        const { passapplayer, wantID } = data;
        console.log( passapplayer,wantID );
        wantsInfo.findOne( { _id: wantID }, function( err, dat ){
            if(dat){
                dat.presentMembers.push(passapplayer);
                dat.save();
                io.emit( 'recpass', { applyStatus: 'success' })
            }

        });
        applyInfo.findOne( { applyTo_WantID: wantID }, function( err, dat ){
            if(dat){
                dat.applyStatus = 'success';
                dat.save();
            }
        })
    })
})

//下面这两句是用于调试中适时删除数据库里信息的
//applyInfo.find( {} , function( err, doc ){ doc.map( v => v.remove())});
//wantsInfo.find({},function(err,doc){doc.map(v=>v.remove())});


//允许跨域
app.all( '*' , function( req, res, next ) {
    res.header( "Access-Control-Allow-Origin", "*" );
    res.header( "Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Content-Length,Authorization, Accept,yourHeaderFeild" );
    res.header( "Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS" );
    res.header( "X-Powered-By", ' 3.2.1' )
    res.header( "Content-Type", "application/json;charset=utf-8" );
    next();
    });

app.use( '/user', Router );
server.listen( 9093, console.log( 'server' ))