const Joi = require("joi");

const emailFieldRegEx = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

const userRegisterSchema = Joi.object({
  email: Joi.string().required().pattern(new RegExp(emailFieldRegEx)).messages({
    "any.required": `missing required 'email' field`,
  }),
  password: Joi.string().min(6).required().messages({
    "any.required": `missing required 'password' field`,
  }),
  subscription: Joi.string()
    .valid("starter", "pro", "business")
    .default("starter"),
  token: Joi.string().default(null),
});
const userLoginSchema = Joi.object({
  email: Joi.string().required().pattern(new RegExp(emailFieldRegEx)).messages({
    "any.required": `missing required 'email' field`,
  }),
  password: Joi.string().min(6).required().messages({
    "any.required": `missing required 'password' field`,
  }),
  subscription: Joi.string()
    .valid("starter", "pro", "business")
    .default("starter"),
  token: Joi.string().default(null),
});

const userUpdateSchema = Joi.object({
  subscription: Joi.string()
    .valid("starter", "pro", "business")
    .default("starter")
    .required()
    .messages({
      "any.required": `missing required 'subscription' field`,
    }),
});

module.exports = {
  userRegisterSchema,
  userLoginSchema,
  userUpdateSchema,
};
