import express from "express";
import { NODE_ENV, PORT } from "./config/env.js";
import connectDB from "./config/db.js";
import authRouter from "./routes/auth.route.js";
import cookieParser from "cookie-parser";
import userRouter from "./routes/user.route.js";
import errorMiddleware from "./middlewares/error.middleware.js";
import cors from "cors";

const app = express();

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => res.status(200).send("Application is running!"));

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/user", userRouter);

app.use(errorMiddleware);

connectDB().then(() => {
  app.listen(PORT, () =>
    console.log(
      `Server running at http://localhost:${PORT} in ${NODE_ENV} mode.`
    )
  );
});
