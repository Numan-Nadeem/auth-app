import express from "express";
import {
  login,
  logout,
  refresh,
  signup,
} from "../controllers/auth.controller.js";

const authRouter = express.Router();

authRouter.post("/signup", signup);
authRouter.post("/login", login);
authRouter.post("/logout", logout);
authRouter.get("/refresh", refresh);

export default authRouter;
