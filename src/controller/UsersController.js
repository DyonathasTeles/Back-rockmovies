const {hash, compare}  = require("bcryptjs")
const AppError = require("../utils/AppError")
const sqliteConnection = require("../database/sqlite")


class usersController {

 async create (request, response) {
    const { name, email, password } = request.body

    if(!name) {
      throw new AppError(" name is required! ")
    }

    const database = await sqliteConnection()

    const checkUserExists = await database.get("SELECT * FROM users WHERE email = (?)", [email])

    if(checkUserExists) {
      throw new AppError(" this email is already registered! ")
    }

    const hashPassword = await hash(password, 15)

    await database.run("INSERT INTO users (name, email, password) VALUES (?, ?, ?)", [name, email, hashPassword])
  
    return response.status(201).json()
  }

  async update(request, response) {

    const { name, email, password, oldPassword } = request.body
    const {id} = request.params

    const database = await sqliteConnection()

    const user = await database.get("SELECT * FROM users WHERE id = (?)", [id])

    if (!user) {
      throw new AppError(" this user was not found! ")
    }

    const emailExist = await database.get("SELECT * FROM users WHERE email = (?)", [email])

    if (emailExist && emailExist.id !== user.id) {
      throw new AppError(" this email is already registered! ")
    }

    if (password && !oldPassword) {
        throw new AppError(" old password is required! ")
    }

    if (password && oldPassword) {

      const passwordCompare = await compare(oldPassword, user.password)

      if(!passwordCompare) {
        throw new AppError(" you entered the wrong old password... try again! ")
      }

      user.password = await hash(password, 8)
    }


    user.name = name || user.name
    user.email = email || user.email

    await database.run("UPDATE users SET name = ?, email = ?, password = ?, updated_at = DATETIME('now') WHERE id = ?", [user.name, user.email, user.password, user.id])

    return response.json()
  }

}

module.exports = usersController  