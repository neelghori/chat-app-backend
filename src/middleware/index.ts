import { tokenVerify } from "../utils";

export const verifyToken = async (req: any, res: any, next: any) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const verify = await tokenVerify(token);
    if (!verify) {
      res.errorHandler({
        res,
        message: "You are not authorized",
        statusCode: 401,
      });
      return false;
    }
    const user: any = {};
    if (verify?.id) {
      user.id = verify?.id;
    }
    if (verify?.email) {
      user.email = verify?.email;
    }
    if (verify?.name) {
      user.name = verify?.name;
    }

    req.body.user = user;
    next();
  } catch (err) {
    console.log("verify Token err: ", err);
    res.errorHandler({ res });
  }
};
