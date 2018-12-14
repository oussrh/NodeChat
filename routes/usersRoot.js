module.exports = (app, userModel, mongo) => {

    app.post("/user",(req, res) => {
        const newUser = new userModel({
            user: req.body.user
            // password: 'sdgfsd',
            // name: 'fghjk',
            // lastName: 'fghjk',
            // avatar: 'ghjklm'
        });

        newUser.save(err => {
            if (err) throw err;
            console.log('user ajouté avec succès !');
            res.sendStatus(200)
        });
    });

    app.get("/user", async (req, res) => {
        let query = await userModel.find({});
        query.exec(function (err, data) {
            res.send(data);
        });

    });

    app.get("/user/:id", async (req, res) => {
        let id = new mongo.ObjectId(req.params.id)
        let query = await userModel.find({
            _id: id
        });
        query.exec(function (err, data) {
            res.send(data);
        });

    });

    app.delete("/user/:id", async (req, res) => {
        let id = new mongo.ObjectId(req.params.id);
        let query = await userModel.deleteOne({
            _id: id
        });
        query.exec(function (err, data) {
            res.send(data);
        });
    });

    app.put("/user/pwd/:id", async (req, res) => {
        let id = new mongo.ObjectId(req.params.id);
        let modif = {
            password: req.body.password
        }
        let query = await userModel.updateOne({
            _id: id
        }, modif);
        query.exec(function (err, data) {
            res.send(data);
        });
    });

}