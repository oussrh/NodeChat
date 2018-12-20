module.exports = (app, chatModel, userModel , mongo) => {

    //ADD new chat
    app.post("/chat/i",(req,res)=>{
        const newChat = new chatModel({
            userId : new mongo.ObjectId(req.body.userId),
            withId : new mongo.ObjectId(req.body.withId)
        });
        newChat.save(err => {
            if (err) throw err;
            console.log('chat ajouté avec succès !');
            res.sendStatus(200);
        });
    });
    //GET info chat
    app.get("/chat/i/:id",(req, res) => {
        let id = new mongo.ObjectId(req.params.id);
        let query = chatModel.find({
            userId: id
        });
        query.exec(function (err, data) {
            res.send(data);
        });
    });
    //GET friend info
    app.get("/chat/with/:id",(req, res) => {
        let id = new mongo.ObjectId(req.params.id);
        let query = userModel.find({
            _id: id
        });
        query.exec(function (err, data) {
            res.send(data);
        });
    });

    // DELETE Chat
    app.delete("/chat/with/:id",(req,res)=>{
        let id = new mongo.ObjectId(req.params.id);
        let query = chatModel.deleteOne({
            _id: id
        });
        query.exec(function (err, data) {
            res.send(data);
        });

    });
};