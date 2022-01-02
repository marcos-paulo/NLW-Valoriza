import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";

interface IPayload {
  sub: string;
}

export function ensureAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction
) {
  // Receber o Token
  const authToken = request.headers.authorization;
  // Validar se token está preenchido
  if (!authToken) {
    return response.status(401).json({ message: "Invalid token" }).end();
  }
  const [, token] = authToken.split(" ");
  try {
    // verificar a validade do token
    const { sub } = verify(token, process.env.SECRET_KEY) as IPayload;
    request.user_id = sub;
  } catch (err) {
    return response.status(401).end();
  }
  // Recuperar informações do usuário
  return next();
}
