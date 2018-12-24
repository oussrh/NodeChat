module.exports = (app, models, mongo) => {

    //ADD new chat
    app.post("/chat/i", (req, res) => {
        let userId = new mongo.ObjectId(req.body.userId);
        let withId = new mongo.ObjectId(req.body.withId);
        console.log(userId,withId)
        let chat = models.chats.find({
            $and: [{
                    userId: userId
                },
                {
                    withId: withId
                }
            ]
        });
        chat.exec( (err, data) => {
            if (!data.length) {
                const newChat = new models.chats({
                    userId: userId,
                    withId: withId
                });
                newChat.save(err => {
                    if (err) throw err;
                    console.log('chat ajouté avec succès !');
                    res.sendStatus(200);
                });
            }
        });
    });
    //GET info chat
    app.get("/chat/i/:id/", (req, res) => {
        let id = new mongo.ObjectId(req.params.id);
        let query = models.chats.find({
            userId: id
        });
        query.exec( (err, data) => {
            res.send(data);
        });
    });
    //GET friend info
    app.get("/chat/with/:id", (req, res) => {
        let id = new mongo.ObjectId(req.params.id);
        let query = models.users.find({
            _id: id
        });
        query.exec( (err, data) => {
            res.send(data);
        });
    });
    //Check if existe
    app.get("/chat/:withid/:iduser", (req, res) => {
        let withid = new mongo.ObjectId(req.params.withid);
        let iduser = new mongo.ObjectId(req.params.iduser);
        let query = models.chats.find({
            $and: [{
                    withId: withid
                },
                {
                    userId: iduser
                }
            ]
        });
        query.exec( (err, data) => {
            res.send(data);
        });
    });

    // DELETE Chat
    app.delete("/chat/with/:id", (req, res) => {
        let id = new mongo.ObjectId(req.params.id);
        let query = models.chats.deleteOne({
            _id: id
        });
        query.exec( (err, data) => {
            res.send(data);
        });

    });
};