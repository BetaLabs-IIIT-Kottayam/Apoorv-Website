import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import 'express-async-errors'
// import './types/express/index.d.ts'

import connectDB from "./utils/db"
import { createAdmin } from "./controllers/authController"

import errorHandlerMiddleware from "./middlewares/error-handler"
import notFound from "./middlewares/not-found"


import authRouter from "./routes/authRouter"
import merchRouter from "./routes/merchRouter"


dotenv.config()

const app = express()

app.use(express.json())
app.use(cors())


// app.get("/api/v1", (req, res) => {
//   res.send("Welcome to the server")
// })

// app.use("/api/v1/public", (req, res) => {
//   res.send("Welcome to the public route")
// })
// app.use("/api/v1/private", authenticateUser(),  (req, res) => {
//   res.send("Welcome to the private route")
// })
app.use("/api/v1/login", authRouter)
app.use("/api/v1/merch", merchRouter)
// app.use("/api/v1/profile", profileRouter)
// app.use("/api/v1/rides", rideRouter)




app.use(errorHandlerMiddleware)
app.use(notFound)

const port = process.env.PORT || 5000

const start = async () => {
  try {
    await connectDB()
    await createAdmin()
    app.listen(port, () => {
      console.log(`[server]: Server is running at http://localhost:${port}`)
    })
  } catch (err) {
    console.log(err)
  }
}

start()