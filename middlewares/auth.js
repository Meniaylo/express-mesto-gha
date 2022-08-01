const jwt = require('jsonwebtoken');

const JWT_SECRET_KEY = 'My-babys-got-a-secret';
const UNAUTHORIZED_CODE = 401;

const auth = (req, res, next) => {
  const cookies = req.cookies;

  if (!cookies.jwt) {
    next(res.status(UNAUTHORIZED_CODE).send({ message: "Необходима авторизация" }));
  }

  const token = cookies.jwt;
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET_KEY);
  } catch (err) {
    next(res.status(UNAUTHORIZED_CODE).send({ message: "Необходима авторизация" }));
  }

  req.user = payload;

  next();
};

module.exports = auth;