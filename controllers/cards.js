const Card = require('../models/card');

const DATA_ERROR_CODE = 400;
const NOTFOUND_ERROR_CODE = 404;
const COMMON_ERROR_CODE = 500;

// const checkError = (errParameter, res, parameterName, status, messageText) => {
//   if (errParameter === parameterName) {
//     return res.status(status).send({ message: messageText });
//   }
// }

const cardsController = (_req, res) => {
  Card.find()
  .then((data) => res.send(data))
  .catch((err) => {
    // checkError(err.name, res, 'ValidationError', DATA_ERROR_CODE, 'Введите корректные данные');
    if (err.name === 'ValidationError') {
      return res.status(DATA_ERROR_CODE).send({ message: "Введите корректные данные" });
    }
    return res.status(COMMON_ERROR_CODE).send({ message: "На сервере произошла ошибка" });
  })
};

const deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
  .orFail(new Error('NotValidId'))
  .then((_card) => {
    res.send({ message: 'Карточка удалена' });
  })
  .catch((err) => {
    // checkError(err.name, res, 'CastError', DATA_ERROR_CODE, 'Введите корректные данные');
    // checkError(err.message, res, 'NotValidId', NOTFOUND_ERROR_CODE, 'Карточка c указанным _id не найдена');
    if (err.name === 'CastError') {
      return res.status(DATA_ERROR_CODE).send({ message: "Введите корректные данные" });
    }
    if (err.message === 'NotValidId') {
      return res.status(NOTFOUND_ERROR_CODE).send({ message: "Карточка c указанным _id не найдена" });
    }
    return res.status(COMMON_ERROR_CODE).send({ message: "На сервере произошла ошибка" });
  })
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(DATA_ERROR_CODE).send({ message: "Введите корректные данные" });
      }
      return res.status(COMMON_ERROR_CODE).send({ message: "На сервере произошла ошибка" });
    })
};

const putCardLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .orFail(new Error('NotValidId'))
    .then((card) => {
      res.send(card);
    })
    .catch((err) => {
      console.log(err.name);
      if (err.name === 'CastError') {
        return res.status(DATA_ERROR_CODE).send({ message: "Переданы некорректные данные для постановки лайка" });
      }
      if (err.statusCode === 404) {
        return res.status(NOTFOUND_ERROR_CODE).send({ message: "Передан несуществующий _id карточки" });
      }
      if (err.message === 'NotValidId') {
        return res.status(NOTFOUND_ERROR_CODE).send({ message: "Карточка с указанным _id не найдена" });
      }
      return res.status(COMMON_ERROR_CODE).send({ message: "На сервере произошла ошибка" });
    })
};

const deleteCardLike = (req, res) => {
  const { _id } = req.user
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: _id } },
    { new: true }
  )
  .orFail(new Error('NotValidId'))
  .then((card) => {
    res.send(card);
  })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(DATA_ERROR_CODE).send({ message: "Переданы некорректные данные для снятия лайка" });
      }
      if (err.statusCode === 404) {
        return res.status(NOTFOUND_ERROR_CODE).send({ message: "Передан несуществующий _id карточки" });
      }
      if (err.message === 'NotValidId') {
        return res.status(NOTFOUND_ERROR_CODE).send({ message: "Карточка с указанным _id не найдена" });
      }
      return res.status(COMMON_ERROR_CODE).send({ message: "На сервере произошла ошибка" });
    })
};

module.exports = { cardsController, createCard, deleteCard, putCardLike, deleteCardLike };