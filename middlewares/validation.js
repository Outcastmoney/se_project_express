const { celebrate, Joi } = require('celebrate');
const validator = require('validator');

// URL validation helper function
const validateURL = (value, helpers) => {
  if (validator.isURL(value)) {
    return value;
  }
  return helpers.error('string.uri');
};

// User validation schemas
const validateUserCreate = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    avatar: Joi.string().required().custom(validateURL),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

const validateUserLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

const validateUserUpdate = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    avatar: Joi.string().custom(validateURL),
  }).min(1),
});

// ClothingItem validation schemas
const validateItemCreate = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    weather: Joi.string().required(),
    imageUrl: Joi.string().required().custom(validateURL),
  }),
});

const validateItemId = celebrate({
  params: Joi.object().keys({
    itemId: Joi.string().alphanum().length(24).required(),
  }),
});

module.exports = {
  validateUserCreate,
  validateUserLogin,
  validateUserUpdate,
  validateItemCreate,
  validateItemId,
};
