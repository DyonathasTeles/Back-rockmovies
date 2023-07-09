const { Router } = require("express")
const UsersController = require("../controller/UsersController")
const UserAvatarController = require("../controller/UserAvatarController")

const multer = require("multer")
const uploadConfig = require("../configs/upload")

const ensureAuthenticated = require("../middleware/ensureAuthenticated")

const upload = multer(uploadConfig.MULTER)

const usersRoutes = Router()
const usersController = new UsersController()
const userAvatarController = new UserAvatarController()

usersRoutes.post("/", usersController.create)
usersRoutes.put("/", ensureAuthenticated, usersController.update)
usersRoutes.patch("/avatar", ensureAuthenticated, upload.single("avatar") , userAvatarController.update)

module.exports = usersRoutes