import bcrypt from "bcrypt";
import { User } from "../schema/user";
import { generateToken } from "../utils/index";
import mongoose from "mongoose";
class UserModel {
  async isExist(data: any) {
    const isExist = await User.findOne({ email: data?.email });
    if (isExist) {
      return {
        message: "Email is already exist in our system",
      };
    }
    return true;
  }

  async createUser(data: any) {
    const createUserData = {
      ...data,
      password: await bcrypt.hash(data.password, 12),
    };
    const isExists = await this.isExist(data);
    if (isExists) {
      return isExists;
    } else {
      return await User.create(createUserData);
    }
  }

  async login(data: any) {
    const { email, password } = data;
    const user = await User.findOne({ email: email });
    if (!user) {
      return {
        error: true,
        message: "Your email is not exist in our system",
      };
    }
    const result = await bcrypt.compare(password, user.password);
    if (!result) {
      return {
        error: true,
        message: "password does not match",
      };
    }

    const userData = {
      id: user._id,
      name: user.name,
      email: user.email,
    };
    return {
      ...userData,
      token: await generateToken(userData),
    };
  }

  async userList(id?: any) {
    return await User.find(id ? { _id: id } : {});
  }
  async updateUser(user_id: string, data: any) {
    const isExist = await User.findOne({
      _id: user_id,
    });
    if (!isExist) {
      return {
        error: true,
        message: "Invalid user id",
      };
    }
    const obj = {
      name: data?.name,
    };
    if (data?.profile_photo) {
      //@ts-ignore
      obj["profile_photo"] = data?.profile_photo;
    }
    return await User.updateOne(
      { _id: user_id },
      {
        $set: { ...obj },
      }
    );
  }
}

export const userModel = new UserModel();
