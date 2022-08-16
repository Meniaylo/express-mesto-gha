const jwt = require('jsonwebtoken');

const JWT_SECRET_KEY = 'My-babys-got-a-secret';
const UnauthorizedError = require('../errors/unauthorized-err');

const auth = (req, _res, next) => {
  const { cookies } = req;

  if (!cookies.jwt) {
    next(new UnauthorizedError('Необходима авторизация'));
    return;
  }

  const token = cookies.jwt;
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET_KEY);
  } catch (err) {
    next(new UnauthorizedError('Необходима авторизация'));
    return;
  }

  req.user = payload;

  next();
};

module.exports = auth;
