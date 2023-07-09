require("express-async-errors")
const express = require("express")

const routes = require("./router")
const AppError = require("./utils/AppError")
const uploadConfig = require("./configs/upload")
const cors = require("cors")

const migrationsRun = require("./database/sqlite/migrations")

const APP = express()
APP.use(cors())
APP.use("/files", express.static(uploadConfig.UPLOADS_FOLDER))
APP.use(express.json())
APP.use(routes)

migrationsRun()

APP.use((error, request, response, next) => {
  if (error instanceof AppError) {
    return response.status(error.statusCode).json({
      status: "error",
      message: error.message
    })
  }

  console.error(error);

  return response.status(500).json({
    status: "error",
    message: "internal server error"
  })
})

const PORT = 8081
APP.listen(PORT, () => console.log("entrei na porta " + PORT))  