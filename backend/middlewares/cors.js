const {
  allowedCors,
  ALLOWED_METHODS,
} = require('../utils/constants');

module.exports = ((req, res, next) => {
  const { origin } = req.headers;
  const { method } = req;

  const requestHeaders = req.headers['access-control-request-headers'];

  if (allowedCors.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Credentials', true);
  }
  if (method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', ALLOWED_METHODS);
    res.header('Access-Control-Allow-Headers', requestHeaders);
    res.status(200).send();
    return;
  }
  next();
});
