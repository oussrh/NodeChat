let express = require('express');
let cors = require('cors');
let bodyParser = require('body-parser');
let mongoose = require('mongoose');
let mongo = require('mongodb');

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use(express.static('public'));
app.use('/', express.static(__dirname + '/public'));

require('./db/dbCnx')(mongoose);

let userModel = require('./db/userSchema');
require("./routes/usersRoot")(app,userModel,mongo);

let chatModel = require('./db/chatSchema');
require("./routes/chatsRoot")(app,chatModel,userModel,mongo);

let blablaModel = require('./db/blablaSchema');
require("./routes/blablaRoot")(app,chatModel,userModel,blablaModel,mongo);

const PORT = 8080; //|| process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running`);
});
