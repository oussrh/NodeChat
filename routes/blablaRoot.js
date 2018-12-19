module.exports = (app,chatModel,userModel,blablaModel,mongo) => {

    app.post('/msg',(req,res)=>{
        console.log(req.body.msg);
        let newMsg = new blablaModel({
            userId : new mongo.ObjectId(req.body.userId),
            chatId : new mongo.ObjectId(req.body.chatId),
            msg : req.body.msg
        })
        newMsg.save(err => {
            if (err) throw err;
            console.log('msg ajouté avec succès !');
            res.sendStatus(200);
        });
    });
    //get user msgs
    app.get('/msg/:id',(req,res)=>{
        let id = new mongo.ObjectId(req.params.id);//id chat
        let query = blablaModel.find({
            chatId: id
        });
        query.exec(function (err, data) {
            res.send(data);
        });
    });
   
}