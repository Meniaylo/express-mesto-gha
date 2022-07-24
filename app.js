const express = require('express');
const { PORT = 3000 } = process.env;
const mongoose = require('mongoose');
const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');
const bodyParser = require('body-parser');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');

const app = express();

const limiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	max: 100,
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})

app.use(limiter);
app.use(helmet());

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

app.use('*', (_req, res) => {
  return res.status(404).send({ message: 'Not Found' })
})

app.listen(PORT, () => {
  console.log(`Listening port ${PORT}`);
})