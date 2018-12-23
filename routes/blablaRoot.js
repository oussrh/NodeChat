module.exports = (app, models, mongo, io) => {
    //get user msgs
    app.get('/msg/:withid/:userid', (req, res) => {
        let userid = new mongo.ObjectId(req.params.userid);
        let withid = new mongo.ObjectId(req.params.withid);
        let query = models.blabla.find({
            $or: [{
                    $and: [{
                        senderId: userid
                    }, {
                        receiverId: withid
                    }]
                },
                {
                    $and: [{
                        senderId: withid
                    }, {
                        receiverId: userid
                    }]
                }
            ]
        }).sort({
            date: -1
        });
        query.exec(function (err, data) {
            res.send(data);
        });
    });

    io.on('connection', (socket) => {
        console.log('made socket connection', socket.id);

        socket.on('chat', async (data) => {
            let newMsg = new models.blabla({
                senderId: new mongo.ObjectId(data.senderId),
                receiverId: new mongo.ObjectId(data.receiverId),
                msg: data.msg
            });

            await newMsg.save(err => {
                if (err) throw err;
                console.log('msg ajouté avec succès !');
            });

            await models.blabla.find({
                $or: [{
                        $and: [{
                            senderId: data.senderId
                        }, {
                            receiverId: data.receiverId
                        }]
                    },
                    {
                        $and: [{
                            senderId: data.receiverId
                        }, {
                            receiverId: data.senderId
                        }]
                    }
                ]
            }).exec((err, result) => {
                io.sockets.emit('chat', result);
            });
        });
    });

};