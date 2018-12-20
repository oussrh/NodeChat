module.exports = (app,models,mongo) => {

    app.post('/msg',(req,res)=>{
        console.log(req.body.msg);
        let newMsg = new models.blabla({
            userId : new mongo.ObjectId(req.body.userId),
            chatId : new mongo.ObjectId(req.body.chatId),
            msg : req.body.msg
        });
        newMsg.save(err => {
            if (err) throw err;
            console.log('msg ajouté avec succès !');
            res.sendStatus(200);
        });
    });
    //get user msgs
    app.get('/msg/:id',(req,res)=>{
        let id = new mongo.ObjectId(req.params.id);//id chat
        let query = models.blabla.find({
            chatId: id
        });
        query.exec(function (err, data) {
            res.send(data);
        });
    });

};