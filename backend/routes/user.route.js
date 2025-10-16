import express from "express";
import { getUserProfile } from "../controllers/user.controller.js";
import verifyToken from "../middlewares/verifyToken.middleware.js";

const userRouter = express.Router();

userRouter.use(verifyToken);

userRouter.get("/me", getUserProfile);

export default userRouter;
