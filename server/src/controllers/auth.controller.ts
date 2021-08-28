import { UserController } from "./user.controller";
import { compare, hash } from "bcryptjs";
import { createRefreshToken, createAccessToken } from "../utils/auth.utils";
import { ErrorWithStatusCode } from "../error";

interface LoginPayload {
  email: string;
  password: string;
}

interface RegisterPayload {
  email: string;
  password: string;
}

interface Tokens {
  accessToken: string;
  refreshToken: string;
}

export class AuthController {
  public register = async (payload: RegisterPayload) => {
    const userController = new UserController();
    try {
      const hashedPassword = await hash(payload.password, 12);
      await userController.createUser({
        email: payload.email,
        password: hashedPassword,
      });
    } catch (error) {
      throw error;
    }
  };

  public login = async (payload: LoginPayload): Promise<Tokens> => {
    //   check if user email exist
    const userController = new UserController();
    const user = await userController.getUserByEmail(payload.email);
    if (!user) throw new ErrorWithStatusCode("invalid login credentails", 404);
    //   user found
    const validPassword = await compare(payload.password, user.password);
    if (!validPassword)
      throw new ErrorWithStatusCode("invalid login credentials", 404);
    //   password is valid
    return {
      accessToken: createAccessToken(user),
      refreshToken: createRefreshToken(user),
    };
  };
}
