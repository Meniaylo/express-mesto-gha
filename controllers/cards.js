const Card = require('../models/card');

const NotFoundError = require('../errors/not-found-err');
const DataError = require('../errors/data-err');
const ForbiddenError = require('../errors/forbidden-err');

const cardsController = (_req, res, next) => {
  Card.find()
    .then((data) => res.send(data))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new DataError('Введите корректные данные');
      }
      next(err);
    })
    .catch(next);
};

const deleteCard = (req, res, next) => {
  Card.findOne({ _id: req.params.cardId })
    .orFail(new Error('NotValidId'))
    .then((card) => {
      if (String(card.owner) === req.user._id) {
        return card.remove()
          .then(() => res.send({ message: 'Карточка удалена' }))
          .catch((err) => next(err))
          .catch(next);
      }
      throw new ForbiddenError('Не ты порождал - не тебе и убивать!');
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new DataError('Введите корректные данные');
      }
      if (err.message === 'NotValidId') {
        throw new NotFoundError('Карточка c указанным _id не найдена');
      }
      next(err);
    })
    .catch(next);
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new DataError('Введите корректные данные');
      }
      next(err);
    })
    .catch(next);
};

const putCardLike = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(new Error('NotValidId'))
    .then((card) => {
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new DataError('Переданы некорректные данные для постановки лайка');
      }
      if (err.statusCode === 404) {
        throw new NotFoundError('Передан несуществующий _id карточки');
      }
      if (err.message === 'NotValidId') {
        throw new NotFoundError('Карточка с указанным _id не найдена');
      }
      next(err);
    })
    .catch(next);
};

const deleteCardLike = (req, res, next) => {
  const { _id } = req.user;
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: _id } },
    { new: true },
  )
    .orFail(new Error('NotValidId'))
    .then((card) => {
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new DataError('Переданы некорректные данные для снятия лайка');
      }
      if (err.statusCode === 404) {
        throw new NotFoundError('Передан несуществующий _id карточки');
      }
      if (err.message === 'NotValidId') {
        throw new NotFoundError('Карточка с указанным _id не найдена');
      }
      next(err);
    })
    .catch(next);
};

module.exports = {
  cardsController,
  createCard,
  deleteCard,
  putCardLike,
  deleteCardLike,
};
