const User = require('../models/user');

const DATA_ERROR_CODE = 400;
const NOTFOUND_ERROR_CODE = 404;
const COMMON_ERROR_CODE = 500;

const usersController = (_req, res) => {
  User.find()
  .then((data) => res.send(data))
  .catch((err) => {
    if (err.name === 'ValidationError') {
      return res.status(DATA_ERROR_CODE).send({ message: "Введите корректные данные" });
    }
    return res.status(COMMON_ERROR_CODE).send({ message: "На сервере произошла ошибка" });
  })
};

const userController = (req, res) => {
  const { userId } = req.params;
  User.findOne({ _id: userId })
    .orFail(new Error('NotValidId'))
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(DATA_ERROR_CODE).send({ message: 'Введите корректные данные' });
      }
      if (err.message === 'NotValidId') {
        return res.status(NOTFOUND_ERROR_CODE).send({ message: 'Пользователь по указанному _id не найден' });
      }
      return res.status(COMMON_ERROR_CODE).send({ message: 'На сервере произошла ошибка' });
    })
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(DATA_ERROR_CODE).send({ message: "Введите корректные данные" });
      }
      return res.status(COMMON_ERROR_CODE).send({ message: "На сервере произошла ошибка" });
    })
};

const updateUserProfile = (req, res) => {
  const { _id } = req.user;
  const { name, about } = req.body;
  User.findByIdAndUpdate(_id, { name, about }, { new: true, runValidators: true })
    .then(user => res.send({ data: user }))
    .catch((err) => {
      console.log(err.name);
      if (err.name === 'ValidationError') {
        return res.status(DATA_ERROR_CODE).send({ message: "Переданы некорректные данные при обновлении профиля" });
      }
      if (err.statusCode === 404) {
        return res.status(NOTFOUND_ERROR_CODE).send({ message: "Пользователь с указанным _id не найден" });
      }
      return res.status(COMMON_ERROR_CODE).send({ message: "На сервере произошла ошибка" });
    })
};

const updateUserAvatar = (req, res) => {
  const { _id } = req.user;
  const { avatar } = req.body;
  User.findByIdAndUpdate(_id, { avatar }, { new: true, runValidators: true })
    .then(user => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(DATA_ERROR_CODE).send({ message: "Переданы некорректные данные при обновлении аватара" });
      }
      if (err.statusCode === 404) {
        return res.status(NOTFOUND_ERROR_CODE).send({ message: "Пользователь с указанным _id не найден" });
      }
      return res.status(COMMON_ERROR_CODE).send({ message: "На сервере произошла ошибка" });
    })
}

module.exports = { userController, usersController, createUser, updateUserProfile, updateUserAvatar };