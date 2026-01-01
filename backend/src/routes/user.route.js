import { Router } from "express";
import {
  getProfile,
  updateProfile,
  getWallet,
 
  depositCallback,
  requestWithdrawal,
} from "../controllers/user.js";
import authMiddleware from "../middleware/auth.middleware.js";

const userRouter = Router();

// Deposit callback (can be called without auth from Paystack webhook)
userRouter.post("/deposit/callback", depositCallback);

// All other routes require authentication
userRouter.use(authMiddleware);

// Get user profile
userRouter.get("/profile", getProfile);

// Update user profile
userRouter.put("/profile", updateProfile);

// Get wallet balance
userRouter.get("/wallet", getWallet);

// Update wallet (deposit/withdraw) - kept for backward compatibility
// userRouter.post("/wallet", updateWallet);

// Request withdrawal
userRouter.post("/withdraw", requestWithdrawal);

export default userRouter;
