import { getCustomRepository } from "typeorm"
import { ComplimentsRepositories } from "../repositories/ComplimentsRepositories"
import { UsersRepositories } from "../repositories/UsersRepositories";
import { CustomError, ErrosEnum } from "../util/CustomError";

interface IComplimentRequest {
  tag_id: string;
  user_sender: string;
  user_receiver: string;
  message: string;
}

class CreateComplimentService {

  async execute({ tag_id, user_sender, user_receiver, message }: IComplimentRequest) {
    const complimentsRepositories = getCustomRepository(ComplimentsRepositories);
    const userRepositories = getCustomRepository(UsersRepositories);
    if (user_sender === user_receiver) {
      throw new CustomError({
        name: "User Receiver",
        errosEnum: ErrosEnum.INCORRECT,
        message: "User cannot send compliment to himself."
      })
    }
    const userReceiverExists = await userRepositories.findOne(user_receiver)
    if (!userReceiverExists) {
      throw new CustomError({
        name: "User Receiver",
        errosEnum: ErrosEnum.DOES_NOT_EXISTS
      });
    }
    const compliment = complimentsRepositories.create({
      user_receiver,
      user_sender,
      tag_id,
      message
    });
    await complimentsRepositories.save(compliment);
    return compliment;
  }

}

export { CreateComplimentService }