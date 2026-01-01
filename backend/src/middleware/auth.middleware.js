import envFile from "../config/env.js";
import jwt from "jsonwebtoken";
import { onError } from "../utils/onError.js";
import UserModel from "../model/user.js";

const authMiddleware = async (req, res, next) => {
  // Try to get token from cookie first, then fallback to Authorization header
  const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];
  
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized, Please login to continue",
    });
  }
  
  try {
    const decoded = jwt.verify(token, envFile.JWT_SECRET);
    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: "Session expired, Please login to continue",
      });
    }
    
    const user = await UserModel.findById(decoded.id);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }
    
    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Session expired, Please login to continue",
      });
    }
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Invalid token, Please login to continue",
      });
    }
    onError(res, error);
  }
};

export default authMiddleware;
