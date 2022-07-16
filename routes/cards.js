const cardRouter = require('express').Router();

const {
  createCard,
  cardsController,
  deleteCard,
  putCardLike,
  deleteCardLike
} = require("../controllers/cards");

cardRouter.get("/", cardsController);
cardRouter.delete("/:cardId", deleteCard);
cardRouter.post("/", createCard);
cardRouter.put("/:cardId/likes", putCardLike);
cardRouter.delete("/:cardId/likes", deleteCardLike);

module.exports = cardRouter;