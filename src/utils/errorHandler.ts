import { NextFunction, Request, Response } from "express";
import environments from "../constants/environments.constants";
import errorTypes from "../constants/errorTypes.constants";
import ApiError from "./apiError";
import { IError } from "./common";

const handleCastErrorDB = (err: { path: string; value: string }) => {
  return new ApiError(`Invalid ${err.path}: ${err.value} provided.`, 400);
};

const handleDuplicateErrorDB = (err: { [key: string]: string }) => {
  const message = Object.keys(err.keyValue)
    .map((errorKey: any) => `${errorKey}: ${err.keyValue[errorKey]}`)
    .join(", ");
  return new ApiError(
    `Duplicate value provided, ${message}. Please provide unique values.`,
    400
  );
};

const handleValidationErrorDB = (err: { [key: string]: string }) => {
  const message = Object.values(err.errors)
    .map((error: any) => {
      if (error.name === "CastError") {
        return `Expected ${error.valueType} type for ${error.path}, but received ${error.kind}`;
      } else {
        return `Validation failed for ${error.path}, ${error.message}`;
      }
    })
    .join(". ");
  return new ApiError(message, 400);
};

const errorResponseDev = (err: any, res: Response) => {
  res.status(err.statusCode).json({
    success: false,
    error: err,
    message: err.message,
    data: null,
  });
};

const errorResponseProduction = (err: IError | any, res: Response) => {
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

const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
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
