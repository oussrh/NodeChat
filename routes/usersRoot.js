module.exports = (app,models, mongo) => {
    //Add new user
    app.post("/user",(req, res) => {
        const newUser = new models.users({
            email: req.body.email,
            password:req.body.password,
            name: req.body.name,
            lastName: req.body.lastName,
            avatar: ''
        });

        newUser.save(err => {
            if (err) throw err;
            console.log('user ajouté avec succès !');
            res.sendStatus(200);
        });
    });
     
    //Autocomplete search for user;
    app.get("/user/u/:u",(req, res) => {
        let query = models.users.find({email:{$regex:'^'+req.params.u}});
        query.exec(function (err, data) {
            res.send(data);
        }); 
    });

    //Get user data
    app.get("/user/i/:id",(req, res) => {
        let id = new mongo.ObjectId(req.params.id);
        let query = models.users.find({
            _id: id
        });
        query.exec(function (err, data) {
            res.send(data);
        });
    });
    //Delete user
    app.delete("/user/:id", (req, res) => {
        let id = new mongo.ObjectId(req.params.id);
        let query = models.users.deleteOne({
            _id: id
        });
        query.exec(function (err, data) {
            res.send(data);
        });
    });
    //Modify user
    app.put("/user/pwd/:id", (req, res) => {
        let id = new mongo.ObjectId(req.params.id);
        let modif = {
            password: req.body.password
        };
        let query = models.users.updateOne({
            _id: id
        }, modif);
        query.exec(function (err, data) {
            res.send(data);
        });
    });

};