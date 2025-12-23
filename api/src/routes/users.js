import express from "express";
import { validatePassword } from "../middlewares/validatePassword.js";
import { UserController } from "../controllers/userController.js";

export const userRouter = express.Router();

userRouter.post("/auth", validatePassword, UserController.Login);
userRouter.post("/signin", validatePassword, UserController.Register);
