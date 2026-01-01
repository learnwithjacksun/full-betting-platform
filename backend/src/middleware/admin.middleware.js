import UserModel from "../model/user.js";
import { onError } from "../utils/onError.js";

const isAdmin = async (req, res, next) => {
  try {
    const user = await UserModel.findById(req.user.id);
    if (!user || !user.isAdmin) {
      return res.status(401).json({ message: "Unauthorized", success: false });
    }
    next();
  } catch (error) {
    onError(res, error);
  }
};

export default isAdmin;