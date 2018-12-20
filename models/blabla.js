let mongoose = require('mongoose');
let blablaSchema = new mongoose.Schema({
    userId : mongoose.Types.ObjectId,
    chatId : mongoose.Types.ObjectId,
    msg :String,
    Date : { type : Date, default : Date.now }
  });
  module.exports = mongoose.model('blabla', blablaSchema);