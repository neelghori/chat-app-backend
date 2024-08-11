import mongoose from "mongoose";
import { Chat } from "../schema/chat";
import { ChatRoomModel } from "../schema/ChatRoom";
class ChatModel {
  async createChat(data: any) {
    const isexistChat = await Chat.findOne({
      user_id: { $all: [data.sender_id, data.receiver_id] },
    });
    if (isexistChat) {
      return await Chat.findByIdAndUpdate(isexistChat?._id, {
        $push: {
          message: {
            sender_id: data?.sender_id,
            message: data?.message,
            isReaded: false,
          },
        },
      });
    } else {
      return await Chat.create({
        user_id: [data?.sender_id, data?.receiver_id],
        message: [
          {
            sender_id: data?.sender_id,
            message: data?.message,
            isReaded: false,
          },
        ],
      });
    }
  }
  async getListofChat(data: any) {
    return await ChatRoomModel.aggregate([
      { $match: { users: { $in: [data?.user?.id] } } },
      {
        $addFields: {
          userObjectIds: {
            $map: {
              input: "$users",
              as: "userId",
              in: { $toObjectId: "$$userId" },
            },
          },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "userObjectIds",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      {
        $project: {
          message: 1,
          userDetails: {
            $filter: {
              input: "$userDetails",
              as: "user",
              cond: {
                $ne: [
                  "$$user._id",
                  new mongoose.Types.ObjectId(data?.user?.id),
                ],
              }, // Exclude this user ID
            },
          },
        },
      },
      {
        $project: {
          name: 1,
          message: 1,
          userDetails: {
            $map: {
              input: "$userDetails",
              as: "user",
              in: {
                _id: "$$user._id",
                name: "$$user.name",
                profile_photo: {
                  $concat: [
                    "http://localhost:8080/images/",
                    "$$user.profile_photo",
                  ],
                },
              },
            },
          },
        },
      },
    ]);
  }
}

export const chatModel = new ChatModel();
