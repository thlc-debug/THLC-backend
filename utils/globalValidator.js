const customError = require("./customError.js");

const globalValidator = (func, param) => {
  const validatorObj = func.validate(param);
  if (validatorObj.error)
    throw new customError(validatorObj.error.details[0].message, 400);
  return true;
};

module.exports = globalValidator;
