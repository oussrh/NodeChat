let mongoose = require('mongoose');
let chatSchema = new mongoose.Schema({
    userId : mongoose.Types.ObjectId,
    withId : mongoose.Types.ObjectId,
    Date : { type : Date, default : Date.now }
  });
  module.exports = mongoose.model('chats', chatSchema);