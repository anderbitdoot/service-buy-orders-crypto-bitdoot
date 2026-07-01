import { UserSessionUseCase} from "../../../buy_crypto/application/use-case/UserSessionUseCase";
import { MiddlewareHandler } from "hono";
import jwt from "jsonwebtoken";

import { container } from "tsyringe";
import { InvalidAuthenticationError} from "../exceptionTypes/DomainErrors";

const JWT_SECRET = process.env.JWT_SECRET || "secret";
  
export const authMiddleware: MiddlewareHandler = async (c, next) => {
  const authHeader = c.req.header("authorization");

   if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new InvalidAuthenticationError();
  }

  const token = authHeader.split(" ")[1];

  let payload;
  try {
    payload = jwt.verify(token, JWT_SECRET) as { email: string };
  } catch (error : Error | any) {
   console.log("error :>> ", error.message);
    // Token inválido o expirado 
   throw new  InvalidAuthenticationError();
  }

  // Buscar sesión en la base de datos
  const userSessionUseCase = container.resolve(UserSessionUseCase);
  let session = await userSessionUseCase.findUserSessionByToken(token);
  if (!session) {
    throw new InvalidAuthenticationError();
  }

  c.set("user", session);
  await next();
};