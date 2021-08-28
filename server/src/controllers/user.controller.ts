import { ErrorWithStatusCode } from "../error";
import { QueryFailedError } from "typeorm";
import { User } from "../entity/User";

interface NewUser {
  email: string;
  password: string;
}

export class UserController {
  public getUsers = (): Promise<User[]> => {
    return User.find();
  };

  public getUserById = (id: number) => {
    return User.findOne(id);
  };

  public getUserByEmail = (email: string): Promise<User | undefined> => {
    return User.findOne({ where: { email: email } });
  };

  public createUser = async (user: NewUser) => {
    try {
      await User.insert(user);
    } catch (error) {
      if (error instanceof QueryFailedError) {
        const errorCode = error.message.split(":")[0];
        switch (errorCode) {
          case "ER_DUP_ENTRY":
            throw new ErrorWithStatusCode("email already exist", 409);
          default:
            throw new ErrorWithStatusCode("cannot create new user", 422);
        }
      }
      throw new ErrorWithStatusCode("cannot create new user", 422);
    }
  };
}
