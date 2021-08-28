import { Router } from "express";
import { authRoute } from "./auth.route";
import { userRoute } from "./user.route";

export const routes = Router();
routes.get("/", (_req, res) => {
  return res.json({
    message: "Hello World",
  });
});
routes.use("/auth", authRoute);
routes.use("/users", userRoute);
