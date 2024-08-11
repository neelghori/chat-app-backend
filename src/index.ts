// src/index.ts
import dotenv from "dotenv";
dotenv.config();
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { databaseConnection } from "./database/database";
import { ErrorHandler, responseHandler } from "./utils/Handler";
import { userRouter } from "./Router/user";
import { chatRouter } from "./Router/chat";
import path from "path";
import { Server } from "socket.io";
import { SocketIoFunction } from "./utils/index";
import http from "http";
const app = express();
const port = process.env.PORT || 8080;

databaseConnection();
const server = http.createServer(app);

app.use(bodyParser.json());
app.use(cors());
app.use("/images", express.static(path.join(__dirname, "./uploads")));

app.use((req, res: any, next) => {
  res.handler = responseHandler;
  next();
});

app.use((req, res: any, next) => {
  res.errorHandler = ErrorHandler;
  next();
});
app.use("/", userRouter);
app.use("/", chatRouter);

server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

const socket = new Server(server);
SocketIoFunction(socket);
