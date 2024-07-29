const customError = require("./customError.js");
const {
  EMAIL_ALREADY_EXIST,
  ERROR_UNKNOWN,
  INVALID_ID_VALUE,
} = require("./constants.js");

const castErrorHandler = (err) => {
  return new customError(INVALID_ID_VALUE.message, INVALID_ID_VALUE.status);
};

const duplicateKeyErrorHandler = (err) => {
  return new customError(
    EMAIL_ALREADY_EXIST.message,
    EMAIL_ALREADY_EXIST.status
  );
};

const validationErrorHandler = (error) => {
  const err = Object.values(error.errors).map((val) => val.message);
  const errorMessage = err.join(". ");
  return new customError(errorMessage, 400);
};

const devErrors = (res, error) => {
  return res.status(error.statusCode).send({
    status: error.statusCode,
    message: error.message,
    stackTrace: error.stack,
  });
};

const prodErrors = (res, error) => {
  if (error.isOperational) {
    return res.status(error.statusCode).send({
      status: error.statusCode,
      message: error.message,
    });
  } else {
    return res.status(ERROR_UNKNOWN.status).send({
      status: "error",
      message: ERROR_UNKNOWN.message,
    });
  }
};

const globalErrorHandler = (error, req, res, next) => {
  error.statusCode = error.statusCode || 500;
  error.status = error.status || "error";

  if (process.env.NODE_ENV === "development") {
    if (error.name === "CastError") {
      error = castErrorHandler(error);
    }
    if (error.code === 11000) {
      error = duplicateKeyErrorHandler(error);
    }
    if (error.name === "ValidationError") {
      error = validationErrorHandler(error);
    }
    devErrors(res, error);
  } else if (process.env.NODE_ENV === "production") {
    if (error.name === "CastError") {
      error = castErrorHandler(error);
    }
    if (error.name === "ValidationError") {
      error = validationErrorHandler(error);
    }
    if (error.code === 11000) {
      error = duplicateKeyErrorHandler(error);
    }
    prodErrors(res, error);
  }
};

module.exports = globalErrorHandler;
