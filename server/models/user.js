const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Поле 'name' должно быть заполнено"],
    minlength: 2,
    maxlength: 30
  },
  about: {
    type: String,
    required: [true, "Поле 'about' должно быть заполнено"],
    minlength: 2,
    maxlength: 30
  },
  avatar: {
    type: String,
    required: [true, "Поле 'avatar' должно быть заполнено"]
  }
});

const userModel = mongoose.model('user', userSchema);

module.exports = userModel;