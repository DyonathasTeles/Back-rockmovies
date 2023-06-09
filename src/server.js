require("express-async-errors")
const express = require("express")

const routes = require("./router")
const AppError = require("./utils/AppError")

const migrationsRun = require("./database/sqlite/migrations")

const APP = express()
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