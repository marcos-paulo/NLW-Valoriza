import { NextFunction, Request, Response } from "express";
import { CustomError } from "../util/CustomError";

export function ensureError(
  err: Error,
  request: Request,
  response: Response,
  next: NextFunction
) {
  if (err instanceof CustomError) {
    return response.status(err.iMessageStatus.status).json({
      error: err.iMessageStatus.mensagem,
    });
  }
  console.log(err.message);
  console.log(err.stack);
  return response.status(500).json({
    status: "error",
    message: "Internal Server Error",
  });
}
