import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import "express-async-errors";
// import './types/express/index.d.ts'

import connectDB from "./utils/db";
import createAdmin from "./utils/createAdmin";
import startCleanupJob from "./utils/orderCleanup";

import errorHandlerMiddleware from "./middlewares/error-handler";
import notFound from "./middlewares/not-found";

import authRouter from "./routes/authRouter";
import merchRouter from "./routes/merchRouter";
import orderRouter from "./routes/orderRouter";
import dashboardRouter from "./routes/dashboardRouter";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"], // Explicitly allow frontend origins
    credentials: true, // Allow cookies
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(cookieParser());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});

// app.get("/api/v1", (req, res) => {
//   res.send("Welcome to the server")
// })

// app.use("/api/v1/public", (req, res) => {
//   res.send("Welcome to the public route")
// })
// app.use("/api/v1/private", authenticateUser(),  (req, res) => {
//   res.send("Welcome to the private route")
// })
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/merch", merchRouter);
app.use("/api/v1/order", orderRouter);
app.use("/api/v1/dashboard", dashboardRouter);
// app.use("/api/v1/profile", profileRouter)
// app.use("/api/v1/rides", rideRouter)

app.use(errorHandlerMiddleware);
app.use(notFound);

const port = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB();
    await createAdmin();
    startCleanupJob();
    app.listen(port, () => {
      console.log(`[server]: Server is running at http://localhost:${port}`);
    });
  } catch (err) {
    console.log(err);
  }
};

start();
