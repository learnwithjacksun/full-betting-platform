import { Router } from "express";
import {
  placeBet,
  getBets,
  getBetById,
  updateBetStatus,
  cancelBet,
} from "../controllers/bets.js";
import authMiddleware from "../middleware/auth.middleware.js";

const betsRouter = Router();

// All routes require authentication
betsRouter.use(authMiddleware);

// Place a new bet
betsRouter.post("/", placeBet);

// Get all bets (with optional status filter)
betsRouter.get("/", getBets);

// Get a single bet by ID
betsRouter.get("/:id", getBetById);

// Update bet status
betsRouter.patch("/:id/status", updateBetStatus);

// Cancel a pending bet
betsRouter.post("/:id/cancel", cancelBet);

export default betsRouter;

