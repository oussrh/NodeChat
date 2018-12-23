module.exports = (app, models, mongo) => {

    //ADD new chat
    app.post("/chat/i", (req, res) => {
        let userId = req.body.userId;
        let withId = req.body.withId;
        let chat = models.chats({
            userId: userId,
            withId: withId
        })
        if (!chat) {
            const newChat = new models.chats({
                userId: new mongo.ObjectId(userId),
                withId: new mongo.ObjectId(withId)
            });
            newChat.save(err => {
                if (err) throw err;
                console.log('chat ajouté avec succès !');
                res.sendStatus(200);
            });
        }
    });
    //GET info chat
    app.get("/chat/i/:id", (req, res) => {
        let id = new mongo.ObjectId(req.params.id);
        let query = models.chats.find({
            userId: id
        });
        query.exec(function (err, data) {
            res.send(data);
        });
    });
    //GET friend info
    app.get("/chat/with/:id", (req, res) => {
        let id = new mongo.ObjectId(req.params.id);
        let query = models.users.find({
            _id: id
        });
        query.exec(function (err, data) {
            res.send(data);
        });
    });

    // DELETE Chat
    app.delete("/chat/with/:id", (req, res) => {
        let id = new mongo.ObjectId(req.params.id);
        let query = models.chats.deleteOne({
            _id: id
        });
        query.exec(function (err, data) {
            res.send(data);
        });

    });
};