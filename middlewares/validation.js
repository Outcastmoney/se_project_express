const { celebrate, Joi } = require('celebrate');
const validator = require('validator');

// URL validation helper function
const validateURL = (value, helpers) => {
  // First check with validator.isURL with strict options
  if (!validator.isURL(value, {
    protocols: ['http', 'https'],
    require_protocol: true,
    require_host: true,
    require_valid_protocol: true,
    allow_underscores: false,
    host_whitelist: false,
    host_blacklist: false,
    allow_trailing_dot: false,
    allow_protocol_relative_urls: false,
    disallow_auth: false
  })) {
    return helpers.error('string.uri');
  }

  // Additional check for proper domain format
  try {
    const url = new URL(value);
    // Check if hostname has at least one dot (indicating a proper domain)
    if (url.hostname.includes('.') && url.hostname.split('.').length >= 2) {
      // Check that the TLD is at least 2 characters
      const parts = url.hostname.split('.');
      const tld = parts[parts.length - 1];
      if (tld.length >= 2) {
        return value;
      }
    }
  } catch (error) {
    // URL constructor failed, invalid URL
  }
  
  return helpers.error('string.uri');
};

// User validation schemas
const validateUserCreate = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    avatar: Joi.string().custom(validateURL),
    email: Joi.string().email(),
    password: Joi.string(),
  }).min(1), // Only require at least one field to be present
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
