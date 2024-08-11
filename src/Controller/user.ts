import { userModel } from "../Model/User";

class UserController {
  async createUser(req: any, res: any) {
    try {
      req.body.profile_photo = req.file.filename;
      const data = await userModel.createUser(req.body);
      if (!data) {
        return res.errorHandler({
          res,
          //@ts-ignore
          message: data?.message as string,
        });
      }
      res.handler({ res, message: "register successfully" });
    } catch (err) {
      res.errorHandler({ res });
    }
  }

  async login(req: any, res: any) {
    try {
      const data = await userModel.login(req.body);
      if (data?.error) {
        res.errorHandler({
          res,
          message: data.message,
        });
        return false;
      }
      res.handler({ res, message: "login successfully", data });
    } catch (err) {
      res.errorHandler({ res });
    }
  }

  async userList(req: any, res: any) {
    try {
      const data: any = await userModel.userList();

      const extractData =
        data &&
        data.length > 0 &&
        data.map((element: any) => {
          return {
            email: element?.email,
            name: element?.name,
            profile_photo: `http://localhost:8080/images/${element?.profile_photo}`,
            _id: element?._id,
          };
        });
      res.handler({
        res,
        data: extractData,
        message: "get user list successfully",
      });
    } catch (err) {
      res.errorHandler({ res });
    }
  }
  async getUser(req: any, res: any) {
    try {
      const data: any = await userModel.userList(req.body.user.id);

      const extractData =
        data &&
        data.length > 0 &&
        data.map((element: any) => {
          return {
            email: element?.email,
            name: element?.name,
            profile_photo: `http://localhost:8080/images/${element?.profile_photo}`,
            _id: element?._id,
          };
        });
      res.handler({
        res,
        data: extractData,
        message: "get user list successfully",
      });
    } catch (err) {
      res.errorHandler({ res });
    }
  }
  async updateUser(req: any, res: any) {
    try {
      const newBody = {
        name: req.body?.name,
        profile_photo: req.file?.filename ?? null,
      };
      const data: any = await userModel.updateUser(req.body.user.id, newBody);
      if (data?.error) {
        res.errorHandler({
          res,
          message: data.message,
        });
        return false;
      }
      res.handler({ res, message: "User update successfully" });
    } catch (err) {
      res.errorHandler({ res });
    }
  }
}

export const userController = new UserController();
