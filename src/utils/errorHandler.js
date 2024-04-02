import environments from "../constants/environments.constants.js";
import errorTypes from "../constants/errorTypes.constants.js";
import ApiError from "./apiError.js";

const handleCastErrorDB = (err) => {
  return new ApiError(`Invalid ${err.path}: ${err.value} provided.`, 400);
};

const handleDuplicateErrorDB = (err) => {
  const message = Object.keys(err.keyValue)
    .map((errorKey) => `${errorKey}: ${err.keyValue[errorKey]}`)
    .join(", ");
  return new ApiError(
    `Duplicate value provided, ${message}. Please provide unique values.`,
    400
  );
};

const handleValidationErrorDB = (err) => {
  const message = Object.values(err.errors)
    .map((error) => {
      if (error.name === "CastError") {
        return `Expected ${error.valueType} type for ${error.path}, but received ${error.kind}`;
      } else {
        return `Validation failed for ${error.path}, ${error.message}`;
      }
    })
    .join(". ");
  return new ApiError(message, 400);
};

const errorResponseDev = (err, res) => {
  res.status(err.statusCode).json({
    success: false,
    error: err,
    message: err.message,
    data: null,
  });
};

const errorResponseProduction = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      data: null,
    });
  } else {
    res.status(err.statusCode).json({
      success: false,
      message: "Something went wrong!",
      data: null,
    });
  }
};

const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  if (process.env.NODE_ENV === environments.DEVELOPMENT)
    errorResponseDev(err, res);

  if (process.env.NODE_ENV === environments.PRODUCTION) {
    let error = Object.defineProperties(
      {},
      Object.getOwnPropertyDescriptors(err)
    );
    if (err.name === errorTypes.CAST_ERROR) error = handleCastErrorDB(err);
    if (err.code === 11000) error = handleDuplicateErrorDB(err);
    if (err.name === errorTypes.VALIDATION_ERROR)
      error = handleValidationErrorDB(err);

    errorResponseProduction(error, res);
  }
};

export default errorHandler;
