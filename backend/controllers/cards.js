const Card = require('../models/card');
const NotFoundError = require('../errors/NotFoundError');
const ValidationError = require('../errors/ValidationError');
const NoCopyrightError = require('../errors/NoCopyrightError');

const { NOT_FOUND_ERROR_CODE } = require('../utils/constants');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;

  Card.create({
    name, link, owner: req.user._id,
  })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError('Переданы некорректные данные при создании карточки.'));
      } else {
        next(err);
      }
    });
};

module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      const cardOwnerId = String(card.owner);
      if (cardOwnerId === req.user._id) {
        card.remove().catch(next);
        res.send({ card });
      } else {
        next(new NoCopyrightError('Нельзя удалить чужую карточку'));
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ValidationError('Передан некорректный id карточки'));
      } else if (err.statusCode === NOT_FOUND_ERROR_CODE) {
        next(new NotFoundError(`Передан несущетвующий id:${req.params.cardId} карточки`));
      } else {
        next(err);
      }
    });
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: { _id: req.user._id } } },
    { new: true, runValidators: true },
  )
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ValidationError('Переданы некорректные данные для постановки лайка.'));
      } else if (err.statusCode === NOT_FOUND_ERROR_CODE) {
        next(new NotFoundError(`Передан несущетвующий id:${req.params.cardId} карточки`));
      } else {
        next(err);
      }
    });
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true, runValidators: true },
  )
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ValidationError('Переданы некорректные данные для постановки лайка.'));
      } else if (err.statusCode === NOT_FOUND_ERROR_CODE) {
        next(new NotFoundError(`Передан несущетвующий id:${req.params._id} карточки`));
      } else {
        next(err);
      }
    });
};
