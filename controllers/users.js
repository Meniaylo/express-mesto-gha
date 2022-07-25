const User = require('../models/user');
const bcrypt = require('bcrypt');
const validator = require('validator');
const jwt = require('jsonwebtoken');

const OK_CODE = 200;
const DATA_ERROR_CODE = 400;
const UNAUTHORIZED_CODE = 401;
const NOTFOUND_ERROR_CODE = 404;
const COMMON_ERROR_CODE = 500;

const JWT_SECRET_KEY = 'My-babys-got-a-secret';


const login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(DATA_ERROR_CODE).send({ message: "Поля 'email' и 'password' не могут быть пустыми" });
  }

  if (!validator.isEmail(email)) {
    return res.status(DATA_ERROR_CODE).send({ message: "Введен некорректный email" });
  }

  User.findOne({email})
    .then(user => {
      if (!user) {
        return res.status(UNAUTHORIZED_CODE).send({ message: "Неверный email или пароль" });
      } else {
        bcrypt.compare(password, user.password, ((error, isValid) => {

          if (error) {
            return res.status(UNAUTHORIZED_CODE).send({ error: error });
          }

          if (isValid) {
            const token = jwt.sign(
              { _id: user._id },
              JWT_SECRET_KEY,
              { expiresIn: '7d' });

            return res
              .cookie('jwt', token, {
                httpOnly: true,
                sameSite: true
              })
              .status(OK_CODE)
              .send({
                name: user.name,
                about: user.about,
                avatar: user.avatar,
                email: user.email,
              });
          }

          if (!isValid) {
            return res.status(UNAUTHORIZED_CODE).send({ message: "Неверный email или пароль" });
          }

        }))
      }
    })
};

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
  const { name, about, avatar, email, password } = req.body;

  if (!validator.isEmail(email)) {
    return res.status(DATA_ERROR_CODE).send({ message: 'Введите корректный email' });
  }

  bcrypt.hash(password, 10)
    .then(hash => User.create({
      name,
      about,
      avatar,
      email,
      password: hash }))
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

module.exports = {
  userController,
  usersController,
  createUser,
  updateUserProfile,
  updateUserAvatar,
  login
};