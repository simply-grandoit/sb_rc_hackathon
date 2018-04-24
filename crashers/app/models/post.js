// load the things we need
var mongoose = require('mongoose');

// define the schema for our user model
var postSchema = mongoose.Schema({

  title: String,
  location: String,
  url: String,
  time: String,
  date: String,
  description: String,
  address: String,
  group: String
});


// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);
