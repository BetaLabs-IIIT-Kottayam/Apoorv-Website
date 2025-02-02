import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import 'express-async-errors'
import connectDB from "./utils/db"
import errorHandlerMiddleware from "./middlewares/error-handler"
import notFound from "./middlewares/not-found"
import { createAdmin } from "./controllers/authController"


dotenv.config()

const app = express()

app.use(express.json())
app.use(cors())


app.get("/api/v1", (req, res) => {
  res.send("Welcome to the server")
})

// app.use("/api/v1/auth", authRouter)
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