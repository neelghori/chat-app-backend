import { chatModel } from "../Model/Chat";
import { userModel } from "../Model/User";

class ChatController {
  async sendMessage(req: any, res: any) {
    try {
      const data = await chatModel.createChat(req.body);
      res.handler({ res, message: "Send Message Successfully" });
    } catch (err) {
      res.errorHandler({ res });
    }
  }

  async getListofChatRoom(req: any, res: any) {
    try {
      const data = await chatModel.getListofChat(req.body);
      res.handler({ res, data, message: "List" });
    } catch (err) {
      console.log("err===.", err);
      res.errorHandler({ res });
    }
  }
}

export const chatController = new ChatController();
