import * as jose from "jose";
import multer from "multer";
import path from "path";
import { User } from "../schema/user";
import { ChatRoomModel } from "../schema/ChatRoom";
import { Chat } from "../schema/chat";

export const generateRandomPassword = () =>
  [...Array(8)]
    .map(
      () =>
        "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"[
          Math.floor(Math.random() * 62)
        ]
    )
    .join("");

export const generateToken = async (data: any) => {
  try {
    const secret = new TextEncoder().encode(process.env.SECRET_KEY);
    const alg = "HS256";
    const token = await new jose.SignJWT(data)
      .setProtectedHeader({ alg })
      .setIssuedAt()
      .setIssuer("urn:example:issuer")
      .setAudience("urn:example:audience")
      .setExpirationTime("2h")
      .sign(secret);
    return token;
  } catch (error) {
    return false;
  }
};

export const tokenVerify = async (token: any) => {
  try {
    const secrets = new TextEncoder().encode(process.env.SECRET_KEY);
    const { payload, protectedHeader } = await jose.jwtVerify(token, secrets, {
      issuer: "urn:example:issuer",
      audience: "urn:example:audience",
    });
    delete payload.iat;
    delete payload.iss;
    delete payload.aud;
    delete payload.exp;

    return payload ?? false;
    // return decode;
  } catch (error) {
    return false;
  }
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "src/uploads/"); // Directory where files will be stored
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Rename the file
  },
});

export const upload = multer({ storage: storage });

export function SocketIoFunction(io: any) {
  io.on("connection", function (socket: any) {
    console.log("socket connected: ", socket.id);

    // Handle joining a chat room
    socket.on("joinRoom", async (params: any, callback: any) => {
      try {
        const { user_id, room_id } = params;
        console.log("user_id: ", user_id);
        const user = await User.findOne({ _id: user_id });
        console.log("user: ", user);
        const room = await ChatRoomModel.findById(room_id).populate("users");
        console.log("room: ", room);

        if (user && room) {
          socket.join(room_id);
          socket.emit("roomUsers", room.users); // Send current users to the newly joined user
          socket.broadcast.to(room_id).emit("userJoined", user); // Notify others in the room
          console.log(`${user.name} joined room: ${room_id}`);
        }
      } catch (err) {
        console.error("Error joining room:", err);
      }
    });

    // Handle sending a message
    socket.on("sendMessage", async (params: any, callback: any) => {
      try {
        const { user_id, room_id, message_content } = params;
        const user = await User.findById(user_id);
        const room = await ChatRoomModel.findById(room_id);

        if (user && room) {
          const newMessage = new ChatRoomModel({
            chat_id: room._id,
            message: [
              {
                sender_id: user._id,
                message: message_content,
              },
            ],
          });

          const savedMessage = await newMessage.save();

          // Update the latest message in the chat room
          room.latestMessage = savedMessage._id;
          await room.save();

          // Emit the message to the room
          io.to(room_id).emit("newMessage", {
            message: savedMessage,
            sender: user.name,
          });
          console.log(`Message sent to room ${room_id}: ${message_content}`);
        }
      } catch (err) {
        console.error("Error sending message:", err);
      }
    });
  });
}
