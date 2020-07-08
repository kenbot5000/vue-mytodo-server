const mongoose = require('mongoose');
const items = require('./items');
let Schema = mongoose.Schema;

let userSchema = new Schema({
  username: String,
  password: String,
  todos: [items.itemSchema],
});

let User = mongoose.model('User', userSchema);

module.exports.User = User;

