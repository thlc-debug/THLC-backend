const Joi = require("joi");

const registerValidator = Joi.object().keys({
  username: Joi.string().required().messages({
    "string.empty": "Name cannot be empty",
    "any.required": "Name is required",
  }),
  mail: Joi.string()
    .required()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net", "co", "org", "in", "ac"] },
    })
    .messages({
      "string.email": `Enter valid email id`,
      "string.empty": `Email cannot be empty`,
      "any.reqiured": `Email is required`,
      "any.invalid": `Invalid Domain`,
    }),

  phone: Joi.string()
    .pattern(/^[0-9]{10}$/)
    .optional(),

  password: Joi.string()
    .required()
    .regex(/^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{6,}$/)
    .messages({
      "string.min":
        "Password must be minimum 6 characters, with at least a symbol, upper and lower case letters and a number",
      "object.regex": `Password must be minimum 6 characters, with at least a symbol, upper and lower case letters and a number`,
      "string.pattern.base":
        "Password must be minimum 6 characters, with at least a symbol, upper and lower case letters and a number",
      "string.empty": `Password cannot be empty`,
      "any.required": `Password is required`,
    }),

  otp: Joi.number().required().messages({
    "any.reqiured": `Enter the OTP`,
  }),
});

module.exports = registerValidator;
