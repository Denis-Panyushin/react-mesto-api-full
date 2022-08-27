const router = require('express').Router();
const { Joi, celebrate } = require('celebrate');
const {
  getUsers, getUser, getMe, updateUser, updateAvatar,
} = require('../controllers/users');

router.get('/users/me', getMe);
router.get('/users/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().hex().length(24),
  }).unknown(true),
}), getUser);
router.get('/users', getUsers);
router.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }).unknown(true),
}), updateUser);
router.patch('/users/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().pattern(/^(https|http)?:\/\/(www.)?[^-_.\s](\d{1,3}.\d{1,3}.\d{1,3}.\d{1,3})?(:\d+)?(.+[#a-zA-Z/:0-9]{1,})?\.(.+[#a-zA-Z/:0-9]{1,})?$/i),
  }).unknown(true),
}), updateAvatar);

module.exports = router;
