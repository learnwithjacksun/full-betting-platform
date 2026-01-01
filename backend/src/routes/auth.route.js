import { Router } from "express";
import {
  checkAuth,
  login,
  register,
  logout,
  adminLogin,
  verifyOtp,
  resendOtp,
  changePassword,
  forgotPassword,
  resetPassword,
} from "../controllers/auth.js";
import authMiddleware from "../middleware/auth.middleware.js";

const authRouter = Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.post("/logout", logout);
authRouter.post("/admin/login", adminLogin);
authRouter.get("/check", authMiddleware, checkAuth);
authRouter.post("/verify-otp", authMiddleware, verifyOtp);
authRouter.post("/resend-otp", authMiddleware, resendOtp);
authRouter.post("/change-password", authMiddleware, changePassword);
authRouter.post("/forgot-password", forgotPassword);
authRouter.post("/reset-password", resetPassword);

export default authRouter;