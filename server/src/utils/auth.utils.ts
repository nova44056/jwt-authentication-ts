import { CookieOptions } from "express";
import { sign } from "jsonwebtoken";
import { User } from "../entity/User";

export const cookieConfig: CookieOptions = {
  secure: process.env.NODE_ENV === "production" ? true : false,
  sameSite: "strict", // for cross domain
  httpOnly: true,
};

export const createRefreshToken = (user: User) => {
  console.log("refreshToken.tokenVersion", user.tokenVersion);
  return sign(
    { userId: user.id, tokenVersion: user.tokenVersion },
    process.env.REFRESH_TOKEN_SECRET!,
    {
      expiresIn: "7d",
    }
  );
};

export const createAccessToken = (user: User) => {
  console.log("accessToken.tokenVersion", user.tokenVersion);
  return sign(
    { userId: user.id, tokenVersion: user.tokenVersion },
    process.env.ACCESS_TOKEN_SECRET!,
    {
      expiresIn: "1m",
    }
  );
};
