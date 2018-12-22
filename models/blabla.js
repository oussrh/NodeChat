let mongoose = require('mongoose');
let blablaSchema = new mongoose.Schema({
    senderId : mongoose.Types.ObjectId,
    receiverId : mongoose.Types.ObjectId,
    msg :String,
    Date : { type : Date, default : Date.now }
  });
  module.exports = mongoose.model('blabla', blablaSchema);
