const Joi = require('joi');

module.exports.registerValidation = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(255).required(),
    email: Joi.string().email().min(4).required(),
    username: Joi.string().alphanum().min(4).max(16).required(),
    password: Joi.string().min(4).required(),
    inviter: Joi.string().required(),
  });

  return schema.validate(data);
};

module.exports.loginValidation = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().min(4),
    username: Joi.string().alphanum().min(4).max(16),
    password: Joi.string().required(),
  }).xor('email', 'username');

  return schema.validate(data);
};

module.exports.updateUserValidation = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(255),
    email: Joi.string().email().min(4),
    username: Joi.string().alphanum().min(4).max(16),
    inviter: Joi.string(),
    role: Joi.string().valid('member', 'admin', 'superAdmin'),
    isActive: Joi.boolean(),
  });

  return schema.validate(data);
};
