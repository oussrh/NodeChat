const db_url = process.env.DATA_BASE;
module.exports = (mongoose)=>{
mongoose.connect(`${db_url}`,{ useNewUrlParser: true }, function(err) {
    if (err) { throw err; }
    console.log('connected to database');
  });
}