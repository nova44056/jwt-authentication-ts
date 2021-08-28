import { Router } from "express";
import { authenticationGate } from "../middlewares/auth.middleware";
import { UserController } from "../controllers/user.controller";

export const userRoute = Router();
userRoute.get("/", authenticationGate, async (_req, res) => {
  const userController = new UserController();
  const users = await userController.getUsers();
  return res.send(users);
});
