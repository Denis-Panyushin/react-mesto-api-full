/* eslint-disable max-classes-per-file */
const NOT_FOUND_ERROR_CODE = 404;
const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';
const allowedCors = [
  'https://projectMestoFrontendPanyushin.nomoredomains.sbs',
  'http://projectMestoFrontendPanyushin.nomoredomains.sbs',
  'localhost:3000',
];

module.exports = { NOT_FOUND_ERROR_CODE, DEFAULT_ALLOWED_METHODS, allowedCors };
