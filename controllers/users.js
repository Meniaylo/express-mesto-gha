const bcrypt = require('bcrypt');
const validator = require('validator');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const NotFoundError = require('../errors/not-found-err');
const DataError = require('../errors/data-err');
const UnauthorizedError = require('../errors/unauthorized-err');
const ConflictError = require('../errors/conflict-err');

const JWT_SECRET_KEY = 'My-babys-got-a-secret';


const login = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new DataError("Поля 'email' и 'password' не могут быть пустыми");
  }

  if (!validator.isEmail(email)) {
    throw new DataError("Введите корректный email");
  }

  User.findOne({ email }).select('+password')
  .then(user => {
    if (!user) {
      throw new UnauthorizedError("Неверный email или пароль");
    }

    return bcrypt.compare(password, user.password)
      .then((isValid) => {
        if (!isValid) {
          throw new UnauthorizedError("Неверный email или пароль");
        }

        if(isValid) {
          const token = jwt.sign(
            { _id: user._id },
            JWT_SECRET_KEY,
            { expiresIn: '7d' }
          );

          return res
            .cookie('jwt', token, {
              httpOnly: true,
              sameSite: true
            })
            .status(200)
            .send({
              name: user.name,
              about: user.about,
              avatar: user.avatar,
              email: user.email,
            });
        }
      })
  })
  .catch(next)
};

const usersController = (_req, res, next) => {
  User.find()
  .then((users) => res.send(users))
  .catch((err) => {
    if (err.name === 'ValidationError') {
      throw new DataError("Введите корректные данные");
    }
    next(err);
  })
  .catch(next);
};

const userController = (req, res, next) => {
  const { userId } = req.params;
  User.findOne({ _id: userId })
    .orFail(new Error('NotValidId'))
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new DataError("Введите корректные данные");
      }

      if (err.message === 'NotValidId') {
        throw new NotFoundError("Пользователь по указанному _id не найден");
      }
      next(err);
    })
    .catch(next);
};

const createUser = (req, res, next) => {
  const { name, about, avatar, email, password } = req.body;

  if (!email || !password) {
    throw new DataError("Поля 'email' и 'password' не могут быть пустыми");
  }

  if (!validator.isEmail(email)) {
    throw new DataError("Введите корректный email");
  }

  bcrypt.hash(password, 10)
    .then(hash => User.create({
      name,
      about,
      avatar,
      email,
      password: hash }))
      //код возвращает при регистрации юзера вместе с паролем - не дело, надо исправить!
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new DataError("Введите корректные данные");
      }

      if (err.code === 11000) {
        throw new ConflictError("Пользователь с таким 'email' уже существует");
      }

      next(err);
    })
    .catch(next);
};

const getUserInfo = (req, res, next) => {
  const userId = req.user._id;
  User.findOne({ _id: userId })
    .orFail(new Error('NotValidId'))
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new DataError("Введите корректные данные");
      }
      if (err.message === 'NotValidId') {
        throw new NotFoundError("Пользователь по указанному _id не найден");
      }
      next(err);
    })
    .catch(next);
};

const updateUserProfile = (req, res, next) => {
  const { _id } = req.user;
  const { name, about } = req.body;
  User.findByIdAndUpdate(_id, { name, about }, { new: true, runValidators: true })
    .then(user => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new DataError("Переданы некорректные данные при обновлении профиля");
      }
      if (err.statusCode === 404) {
        throw new NotFoundError("Пользователь с указанным _id не найден");
      }
      next(err);
    })
    .catch(next);
};

const updateUserAvatar = (req, res, next) => {
  const { _id } = req.user;
  const { avatar } = req.body;
  User.findByIdAndUpdate(_id, { avatar }, { new: true, runValidators: true })
    .then(user => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new DataError("Переданы некорректные данные при обновлении аватара");
        // return res.status(DATA_ERROR_CODE).send({ message: "Переданы некорректные данные при обновлении аватара" });
      }
      if (err.statusCode === 404) {
        throw new NotFoundError("Пользователь с указанным _id не найден");
        // return res.status(NOTFOUND_ERROR_CODE).send({ message: "Пользователь с указанным _id не найден" });
      }
      next(err);
      // return res.status(COMMON_ERROR_CODE).send({ message: "На сервере произошла ошибка" });
    })
    .catch(next);
}

module.exports = {
  userController,
  usersController,
  createUser,
  getUserInfo,
  updateUserProfile,
  updateUserAvatar,
  login
};