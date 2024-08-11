import express from "express";
import { body } from "express-validator";
import { validate } from "../middleware/validator";
import { userController } from "../Controller/user";
import { upload } from "../utils";
import { verifyToken } from "../middleware";

export const userRouter = express.Router();

userRouter.post(
  "/register",
  upload.single("profile_photo"),
  validate([
    body("name").notEmpty().withMessage("name is required field!"),
    body("email")
      .notEmpty()
      .withMessage("email is required field!")
      .isEmail()
      .withMessage("Enter valid email address"),
    body("password").notEmpty().withMessage("password is required field!"),
  ]),
  userController.createUser
);

userRouter.post(
  "/login",
  validate([
    body("email")
      .notEmpty()
      .withMessage("email is required field!")
      .isEmail()
      .withMessage("Enter valid email address"),
    body("password").notEmpty().withMessage("password is required field!"),
  ]),
  userController.login
);

userRouter.get("/list/user", verifyToken, userController.userList);
userRouter.get("/list/userprofile", verifyToken, userController.getUser);
userRouter.post(
  "/update/profile",
  upload.single("profile_photo"),
  verifyToken,
  userController.updateUser
);
