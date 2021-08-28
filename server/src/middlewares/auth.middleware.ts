import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";

export const authenticationGate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authorization = req.headers.authorization;
  if (!authorization)
    return res.status(401).json({ error: "user is not authenticated" });
  try {
    const token = authorization.split(" ")[1];
    verify(token, process.env.ACCESS_TOKEN_SECRET!);
  } catch (error) {
    return res.status(401).json({ error: "user is not authenticated" });
  }
  return next();
};
