const { Router } = require("express")

const SessionsController = require("../controller/SessionsController")

const sessionsRouter = Router()
const sessionsController = new SessionsController()

sessionsRouter.post("/", sessionsController.create)

module.exports = sessionsRouter