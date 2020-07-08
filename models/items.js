const mongoose = require('mongoose');
let Schema = mongoose.Schema;

let itemSchema = new Schema({
  content: String,
  done: Boolean,
});

let Item = mongoose.model('Item', itemSchema);

module.exports.itemSchema = itemSchema;
module.exports.Item = Item;