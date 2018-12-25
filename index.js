let express = require('express');
let cors = require('cors');
let bodyParser = require('body-parser');
let mongoose = require('mongoose');
let mongo = require('mongodb');
let jwt = require('./jwt/jwt');
let bcrypt = require('bcryptjs');
let socket = require('socket.io');

const app = express();

const port = process.env.PORT;
let server = app.listen(port, () => {
  console.log(`Server running : Port ` + port);
});

let io = socket(server);

app.use(cors());
app.use(bodyParser.json());

require('./db/dbCnx')(mongoose);
let models = require('require-all')(__dirname + '/models');

//Routes
app.use(express.static('public'));
app.use('/', express.static('./public'));

require("./routes/usersRoot")(app, models, mongo, bcrypt, jwt);

require("./routes/chatsRoot")(app, models, mongo);

require("./routes/blablaRoot")(app, models, mongo, io);