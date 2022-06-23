const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Поле 'name' должно быть заполнено"],
    minlength: 2,
    maxlength: 30
  },
  link: {
    type: String,
    required: [true, "Поле 'link' должно быть заполнено"],
  },
  owner: {
    type: String,
    required: true,
  },
  likes: {
    type: Array,
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const userModel = mongoose.model('card', cardSchema);

module.exports = userModel;