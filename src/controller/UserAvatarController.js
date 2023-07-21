const knex = require("../database/knex")
const DiskStorage = require("../providers/diskStorage")
const AppError = require("../utils/AppError")

class UserAvatarController {
  async update(request, response) {
    const user_id = request.user.id
    const avatarFilename = request.file.filename

    const user = await knex("users").where({ id:user_id }).first()

    if(!user) {
      throw new AppError("only authenticated users can change avatar", 401)
    }

    const diskStorage = new DiskStorage()

    if(user.avatar) {
      await diskStorage.deleteFile(user.avatar)
    }

    const filename = await diskStorage.saveFile(avatarFilename)
    user.avatar = filename
    await knex("users").update(user).where({ id:user_id })

    return response.json(user)
  }
}

module.exports = UserAvatarController