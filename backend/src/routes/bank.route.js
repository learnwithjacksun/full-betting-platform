import { Router } from "express";
import {
  getSupportedBanks,
  resolveBankAccount,
  getBankAccount,
  addOrUpdateBankAccount,
  deleteBankAccount,
} from "../controllers/bank.js";
import authMiddleware from "../middleware/auth.middleware.js";

const bankRouter = Router();

// Public route - get supported banks (no auth required)
bankRouter.get("/supported", getSupportedBanks);

// All other routes require authentication
bankRouter.use(authMiddleware);

// Resolve bank account (requires auth for rate limiting)
bankRouter.post("/resolve", resolveBankAccount);

// Get user's bank accounts
bankRouter.get("/", getBankAccount);

// Add or update bank account
bankRouter.post("/", addOrUpdateBankAccount);

// Delete bank account
bankRouter.delete("/:id", deleteBankAccount);

export default bankRouter;

