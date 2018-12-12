module.exports = (app, userModel,mongo) => {

    app.post("/user", (req, res) => {
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

    app.get("/user", (req, res) => {
        let query = userModel.find({});
        query.exec(function (err, data) {
            res.send(data);
        });

    });

    app.delete("/user/:id",(req,res) => {
        let id = new mongo.ObjectId(req.params.id)
        let query = userModel.deleteOne({_id: id});
        query.exec(function (err, data) {
            res.send(data);
        });
    });

}