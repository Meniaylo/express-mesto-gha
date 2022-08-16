const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Поле 'name' должно быть заполнено"],
    minlength: [2, "Поле 'name' должно быть длиной как минимум в 2 символа, сейчас их всего {VALUE}"],
    maxlength: [30, "Поле 'name' должно быть длиной не больше 30 символа, сейчас их аж {VALUE}"],
  },

  link: {
    type: String,
    required: [true, "Поле 'link' должно быть заполнено"],
    validate: {
      validator(v) {
        return /^(http|https):\/\/[^ "]+$/.test(v);
      },
      message: (props) => `${props.value} - не ссылка!`,
    },
  },

  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },

  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
    },
  ],

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const userModel = mongoose.model('card', cardSchema);

module.exports = userModel;
