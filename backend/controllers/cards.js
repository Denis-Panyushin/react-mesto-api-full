const Card = require('../models/card');
const NotFoundError = require('../errors/NotFoundError');
const ValidationError = require('../errors/ValidationError');
const NoCopyrightError = require('../errors/NoCopyrightError');

const { NOT_FOUND_ERROR_CODE } = require('../utils/constants');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new ValidationError('Переданы некорректные данные при создании карточки.');
      }
    })
    .catch(next);
};

module.exports.deleteCard = (req, res, next) => {
  Card.findByIdAndRemove(req.params.cardId)
    .orFail(() => {
      const error = new Error();
      error.statusCode = 404;
      throw error;
    })
    .then((card) => {
      const cardOwnerId = String(card.owner);
      if (cardOwnerId === req.user._id) {
        res.send({ data: card });
      } else {
        next(new NoCopyrightError('Нельзя удалить чужую карточку'));
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new ValidationError('Передан некорректный id карточки');
      } else if (err.statusCode === NOT_FOUND_ERROR_CODE) {
        throw new NotFoundError(`Передан несущетвующий id:${req.params.cardId} карточки`);
      }
    })
    .catch(next);
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true, runValidators: true },
  )
    .orFail(() => {
      const error = new Error();
      error.statusCode = 404;
      throw error;
    })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new ValidationError('Переданы некорректные данные для постановки лайка.');
      } else if (err.statusCode === NOT_FOUND_ERROR_CODE) {
        throw new NotFoundError(`Передан несущетвующий id:${req.params.cardId} карточки`);
      }
    })
    .catch(next);
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true, runValidators: true },
  )
    .orFail(() => {
      const error = new Error();
      error.statusCode = 404;
      throw error;
    })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new ValidationError('Переданы некорректные данные для постановки лайка.');
      } else if (err.statusCode === NOT_FOUND_ERROR_CODE) {
        throw new NotFoundError(`Передан несущетвующий id:${req.params._id} карточки`);
      }
    })
    .catch(next);
};
