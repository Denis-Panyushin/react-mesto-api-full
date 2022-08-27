class NoCopyrightError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 403;
  }
}

module.exports = NoCopyrightError;
