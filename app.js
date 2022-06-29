const express = require('express');
const { PORT = 3000 } = process.env;
const mongoose = require('mongoose');
const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, _res, next) => {
  req.user = {
    _id: '62adeb08e479f661184a35c8'
  };
  next();
});

app.use('/users', userRouter);
app.use('/cards', cardRouter);

mongoose.connect('mongodb://localhost:27017/mestodb');

app.get('*', (_req, res) => {
  res.status(404).send({message: 'Not Found'})
})

app.listen(PORT, () => {
  console.log(`Listening port ${PORT}`);
})