const cardRouter = require('express').Router();

const {
  createCard,
  cardsController,
  deleteCard,
} = require("../controllers/cards");

cardRouter.get("/", cardsController);
cardRouter.delete("/:cardId", deleteCard);
cardRouter.post("/", createCard);

module.exports = cardRouter;