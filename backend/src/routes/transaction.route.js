import { Router } from "express";
import {
  getTransactions,
  getTransactionById,
  approveWithdrawal,
  cancelWithdrawal,
} from "../controllers/transaction.js";
import authMiddleware from "../middleware/auth.middleware.js";
import isAdmin from "../middleware/admin.middleware.js";

const transactionRouter = Router();

// All routes require authentication
transactionRouter.use(authMiddleware);

// Get user's transaction history
transactionRouter.get("/", getTransactions);

// Get single transaction by ID
transactionRouter.get("/:id", getTransactionById);

// Admin routes for withdrawal approval
transactionRouter.post("/:id/approve", isAdmin, approveWithdrawal);
transactionRouter.post("/:id/cancel", isAdmin, cancelWithdrawal);

export default transactionRouter;

