import express from "express";
import { body } from "express-validator";
import { validate } from "../middleware/validator";
import { verifyToken } from "../middleware";
import { chatController } from "../Controller/chat";

export const chatRouter = express.Router();

chatRouter.post(
  "/send",
  verifyToken,
  validate([
    body("message").notEmpty().withMessage("Message is required"),
    body("sender_id").notEmpty().withMessage("Sender Id is required"),
    body("receiver_id").notEmpty().withMessage("Receiver Id is required"),
  ]),
  chatController.sendMessage
);

chatRouter.get("/chat/list", verifyToken, chatController.getListofChatRoom);
