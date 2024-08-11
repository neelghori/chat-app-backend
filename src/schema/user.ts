import mongoose from "mongoose";
import moment from "moment";
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  profile_photo: {
    type: String,
    required: true,
  },
  created_at: {
    type: String,
    default: moment().format("MMM DD YYYY HH:mm:ss"),
  },
  updated_at: {
    type: String,
    default: moment().format("MMM DD YYYY HH:mm:ss"),
  },
});

export const User = mongoose.model("User", userSchema);
