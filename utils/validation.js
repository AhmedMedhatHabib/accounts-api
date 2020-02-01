const Joi = require("@hapi/joi");

const registerValidation = data => {
  const schema = Joi.object({
    firstName: Joi.string()
      .min(3)
      .required(),
    lastName: Joi.string()
      .min(3)
      .required(),
    email: Joi.string()
      .min(6)
      .required()
      .email(),
    password: Joi.string()
      .min(8)
      .required(),
    phone: Joi.string()
      .min(11)
      .required()
  });

  return schema.validate(data);
};

const loginValidation = data => {
  const schema = Joi.object({
    email: Joi.string()
      .min(6)
      .email(),
    phone: Joi.string().min(10),
    password: Joi.string()
      .min(8)
      .required()
  });

  return schema.validate(data);
};

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;
