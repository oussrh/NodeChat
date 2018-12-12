
module.exports = (mongoose)=>{
mongoose.connect('mongodb://127.0.0.1:27017/nodechat',{ useNewUrlParser: true }, function(err) {
    if (err) { throw err; }
    console.log('connected to database');
  });
}