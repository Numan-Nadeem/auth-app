import { NODE_ENV } from "../config/env.js";

const errorMiddleware = (err, req, res, next) => {
  const status = err.statusCode || 500;
  const message = err.message || "Internal Server Error!";

  res.status(status).json({
    success: false,
    message,
    stack: NODE_ENV === "development " ? err.stack : undefined,
  });
};

export default errorMiddleware;

export class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}
