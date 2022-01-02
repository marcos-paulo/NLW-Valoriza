import { getCustomRepository } from "typeorm"
import { CustomError, ErrosEnum } from "../util/CustomError";
import { TagsRepositories } from "../repositories/TagsRepositories"

class CreateTagService {

  async execute(name: string) {
    const tagsRepositories = getCustomRepository(TagsRepositories);
    if (!name) {
      throw new CustomError({
        name: "Name",
        errosEnum: ErrosEnum.INCORRECT
      });
    }
    const tagAlreadyExists = await tagsRepositories.findOne({ name });
    if (tagAlreadyExists) {
      throw new CustomError({
        name: "Tag",
        errosEnum: ErrosEnum.ALREADY_EXISTS
      });
    }
    const tag = tagsRepositories.create({ name });
    await tagsRepositories.save(tag);
    return tag;
  }

}

export { CreateTagService }