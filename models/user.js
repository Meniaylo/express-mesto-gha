const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    default: "Жак-Ив Кусто",
    minlength: 2,
    maxlength: 30
  },
  about: {
    type: String,
    default: "Исследователь",
    minlength: 2,
    maxlength: 30
  },
  avatar: {
    type: String,
    default: "https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png"
  },
  email: {
    type: String,
    required: true,
    unique: [true, "Поле 'email' должно быть заполнено"]
  },
  password: {
    type: String,
    required: [true, "Поле 'password' должно быть заполнено"]
  }
});

const userModel = mongoose.model('user', userSchema);

module.exports = userModel;