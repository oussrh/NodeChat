module.exports = (app, models, mongo, bcrypt, jwt) => {
    //Register new user
    app.post("/user/register", (req, res) => {
        let email = req.body.email;
        let password = req.body.password;
        let name = req.body.name;
        let lastName = req.body.lastName;
        let avatar = req.body.avatar;

        if (email == null || password == null || email == '' || password == '') {
            return res.json({
                'error': 'missing parameters'
            });
        }
        models.users.findOne({
                email: email
            })
            .then(u => {
                if (!u) {
                    bcrypt.hash(password, 5, (err, cryptedPwd) => {
                        const newUser = new models.users({
                            email: email,
                            password: cryptedPwd,
                            name: name,
                            lastName: lastName,
                            avatar: avatar
                        });
                        newUser.save(err => {
                            if (err) throw err;
                            //user added
                        });
                    });
                    //get last user added
                    let user = models.users.findOne({
                        email: email
                    });
                    return res.status(200).json({
                        'userId': user._id,
                        'token': jwt.UserToken(user)
                    });
                } else {
                    return res.json({
                        'error': 'user alerdy exist'
                    });
                }
            })
            .catch(err => {
                res.status(500).json({
                    'error': 'unable to verify user'
                });
            });
    });
    //Login user
    app.post("/user/login", (req, res) => {
        let email = req.body.email;
        let password = req.body.password;

        if (email == null || password == null || email == '' || password == '') {
            return res.json({
                'error': 'missing parameters'
            });
        }
        models.users.findOne({
                email: email
            })
            .then(u => {
                if (u) {
                    bcrypt.compare(password, u.password, (errPwd, resPwd) => {
                        if (resPwd) {
                            return res.status(200).json({
                                'userId': u._id,
                                'token': jwt.UserToken(u)
                            });
                        } else {
                            return res.json({
                                'error': 'password invalid'
                            });
                        }

                    });
                } else {
                    return res.json({
                        'error': 'email invalid'
                    });
                }
            })
            .catch(err => {
                res.status(500).json({
                    'error': 'unable to verify user'
                });
            });
    });
    //**********************************************************************/
    //Autocomplete search for user;
    app.get("/user/u/:u/:id", (req, res) => {
        let query = models.users.find({
            $and: [{
                    _id: {
                        $nin: req.params.id
                    }
                },
                {
                    email: {
                        $regex: '^' + req.params.u
                    }
                }
            ]
        }).select('_id email name lastName');//fields to get
        query.exec(function (err, data) {
            res.send(data);
        });
    });
    //Get user data
    app.get("/user/i/:id", (req, res) => {
        let id = new mongo.ObjectId(req.params.id);
        let query = models.users.find({
            _id: id
        }).select('_id email name lastName');//fields to get
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

    //check cnx
    app.post('/user/cnx',(req,res)=>{
        let token = req.body.token;
         res.send(jwt.checkToken(token));
    });
};

//**********************************************************/

