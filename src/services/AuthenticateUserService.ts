import { compare } from "bcryptjs";
import { sign } from "jsonwebtoken";
import { getCustomRepository } from "typeorm";
import { UsersRepositories } from "../repositories/UsersRepositories";
import { CustomError, ErrosEnum } from "../util/CustomError";

interface IAuthenticateRequest {
  email: string,
  password: string
}

class AuthenticateUserService {

  async execute({ email, password }: IAuthenticateRequest) {
    const usersRepositories = getCustomRepository(UsersRepositories);
    const user = await usersRepositories.findOne({ email });
    const erro = {
      name: "Email/Password",
      errosEnum: ErrosEnum.INCORRECT
    };
    if (!user) {
      throw new CustomError(erro);
    }
    const passwordMatch = await compare(password, user.password);
    if (!passwordMatch) {
      throw new CustomError(erro);
    }
    const token = sign(
      {
        email: user.email,
      },
      process.env.SECRET_KEY,
      {
        subject: user.id,
        expiresIn: "1d"
      }
    );
    return token;
  }

}

export { AuthenticateUserService }