const mongoose = require('mongoose');
let Schema = mongoose.Schema;


let itemSchema = new Schema({
  content: String,
  done: Boolean,
});

let userSchema = new Schema({
  username: String,
  password: String,
  todos: [itemSchema],
});


let User = mongoose.model('User', userSchema);
let Item = mongoose.model('Item', itemSchema);

module.exports.User = User;
module.exports.Item = Item;
