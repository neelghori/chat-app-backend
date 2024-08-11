import mongoose from "mongoose";
import moment from "moment";
const Schema = mongoose.Schema;

const messageSchema = new mongoose.Schema({
  sender_id: String,
  message: String,
});
const chatSchema = new Schema({
  chat_id: {
    type: String,
    required: true,
  },
  message: [messageSchema],
  created_at: {
    type: String,
    default: moment().format("MMM DD YYYY HH:mm:ss"),
  },
  updated_at: {
    type: String,
    default: moment().format("MMM DD YYYY HH:mm:ss"),
  },
});

export const Chat = mongoose.model("Chat", chatSchema);
