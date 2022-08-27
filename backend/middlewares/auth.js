require('dotenv').config();
const jwt = require('jsonwebtoken');
const NoAuthorization = require('../errors/NoAuthorization');

const { NODE_ENV, JWT_SECRET = 'dev-key' } = process.env;

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    next(new NoAuthorization('Необходима авторизация'));
  }
  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });
  } catch (err) {
    next(new NoAuthorization('Необходима авторизация'));
  }

  req.user = payload;
  next();
};
