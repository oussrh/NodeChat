let chatSchema = new mongoose.Schema({
    userId : ObjectId,
    withId : String,
    chatDate : { type : Date, default : Date.now }
  });
