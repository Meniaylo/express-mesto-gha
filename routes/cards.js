const cardRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  createCard,
  cardsController,
  deleteCard,
  putCardLike,
  deleteCardLike
} = require("../controllers/cards");

cardRouter.get("/", cardsController);
cardRouter.delete("/:cardId", deleteCard);

cardRouter.post("/", celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().uri({ scheme: ['http', 'https'] })
  }).unknown(true),
}), createCard);

cardRouter.put("/:cardId/likes", putCardLike);
cardRouter.delete("/:cardId/likes", deleteCardLike);

module.exports = cardRouter;