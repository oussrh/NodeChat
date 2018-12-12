let mongoose = require('mongoose');
let userSchema = new mongoose.Schema({
    user : String,
    password : String,
    name : String,
    lastName : String,
    avatar : String,
    cnxDate : { type : Date, default : Date.now },
    creatDate : { type : Date, default : Date.now }
  });
  
module.exports = mongoose.model('users', userSchema);

