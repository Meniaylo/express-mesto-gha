const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    default: 'Жак-Ив Кусто',
    minlength: [2, "Поле 'name' должно быть длиной как минимум 2 символа, сейчас их всего {VALUE}"],
    maxlength: [30, "Поле 'name' должно быть длиной не больше 30 символа, сейчас их аж {VALUE}"],
  },
  about: {
    type: String,
    default: 'Исследователь',
    minlength: [2, "Поле 'about' должно быть длиной как минимум 2 символа, сейчас их всего {VALUE}"],
    maxlength: [30, "Поле 'about' должно быть длиной не больше 30 символа, сейчас их аж {VALUE}"],
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: {
      validator(v) {
        return /^(http|https):\/\/[^ "]+$/.test(v);
      },
      message: (props) => `${props.value} - не ссылка!`,
    },
  },
  email: {
    type: String,
    required: [true, "Поле 'email' должно быть заполнено"],
    unique: true,
    validate: {
      validator() {
        return /^[A-Z0-9._%+-]+@[A-Z0-9-]+.+.[A-Z]{2,4}$/i;
      },
      message: (props) => `${props.value} - не ссылка!`,
    },
  },
  password: {
    type: String,
    select: false,
    required: [true, "Поле 'password' должно быть заполнено"],
  },
});

module.exports = mongoose.model('user', userSchema);
