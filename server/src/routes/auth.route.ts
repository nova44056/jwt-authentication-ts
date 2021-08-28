import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { verify } from "jsonwebtoken";
import { User } from "../entity/User";
import {
  createRefreshToken,
  createAccessToken,
  cookieConfig,
} from "../utils/auth.utils";
import { getConnection } from "typeorm";
import { ErrorWithStatusCode } from "../error";

export const authRoute = Router();

authRoute.get("/refresh", async (req, res, _next) => {
  const refreshToken = req.cookies.refresh_token;
  if (!refreshToken)
    return res.status(401).json({ ok: false, accessToken: "" });
  const payload: any = verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!);
  const user = await User.findOne(payload.userID);
  if (!user) return res.status(401).send({ ok: false, accessToken: "" });
  if (user.tokenVersion !== payload.tokenVersion) {
    console.log("/refresh user.tokenVersion", user.tokenVersion);
    console.log("/refresh payload.tokenVersion", payload.tokenVersion);
    return res.status(401).send({ ok: false, accessToken: "" });
  }
  console.log("/refresh user.tokenVersion before increment", user.tokenVersion);
  await getConnection().getRepository(User).increment(user, "tokenVersion", 1);
  // sync update
  user.tokenVersion++;
  console.log("/refresh user.tokenVersion after increment", user.tokenVersion);
  res.cookie("refresh_token", createRefreshToken(user), cookieConfig);
  return res.send({ ok: true, accessToken: createAccessToken(user) });
});

authRoute.post("/login", async (req, res, _next) => {
  const authController = new AuthController();
  try {
    const { accessToken, refreshToken } = await authController.login({
      email: req.body.email!,
      password: req.body.password!,
    });

    res.cookie("refresh_token", refreshToken, cookieConfig);

    const payload: any = verify(accessToken, process.env.ACCESS_TOKEN_SECRET!);

    return res.json({
      message: "user is logged in",
      accessToken: accessToken,
      expireAt: new Date(payload.exp * 1000),
    });
  } catch (error) {
    const e = error as ErrorWithStatusCode;
    return res.status(e.code).json({
      error: e.message,
      code: e.code,
    });
  }
});

authRoute.post("/register", async (req, res, _next) => {
  const authController = new AuthController();
  try {
    await authController.register({
      email: req.body.email!,
      password: req.body.password!,
    });
    return res.json({
      message: "new user registed",
    });
  } catch (error) {
    const e = error as ErrorWithStatusCode;
    return res.status(e.code).json({
      error: e.message,
      code: e.code,
    });
  }
});
