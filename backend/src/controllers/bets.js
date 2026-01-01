import { onError } from "../utils/onError.js";
import BetModel from "../model/bets.js";
import UserModel from "../model/user.js";
import generateRandomNumber from "../utils/generateRandomNumbers.js";
import { createTransaction } from "./transaction.js";

// Place a new bet
export const placeBet = async (req, res) => {
  const { selections, stake, totalOdds, potentialWin } = req.body;
  const userId = req.user.id;

  try {
    // Validate required fields
    if (!selections || !Array.isArray(selections) || selections.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one selection is required",
      });
    }

    if (!stake || stake <= 0) {
      return res.status(400).json({
        success: false,
        message: "Valid stake amount is required",
      });
    }

    if (!totalOdds || totalOdds <= 0) {
      return res.status(400).json({
        success: false,
        message: "Valid total odds are required",
      });
    }

    if (!potentialWin || potentialWin <= 0) {
      return res.status(400).json({
        success: false,
        message: "Valid potential win amount is required",
      });
    }

    // Check if user has sufficient balance
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.wallet < stake) {
      return res.status(400).json({
        success: false,
        message: "Insufficient balance",
      });
    }

    // Generate unique bet ID
    const betId = `BET-${Date.now()}-${generateRandomNumber(6)}`;

    // Create bet
    const bet = await BetModel.create({
      user: userId,
      betId,
      selections,
      stake,
      totalOdds,
      potentialWin,
      status: "pending",
      placedAt: new Date(),
    });

    // Deduct stake from user wallet
    user.wallet -= stake;
    await user.save();

    // Create bet transaction
    await createTransaction({
      userId: user.id,
      type: "bet",
      amount: stake,
      description: `Bet placed - Stake: ₦${stake.toLocaleString()}, Potential Win: ₦${potentialWin.toLocaleString()}`,
      status: "completed",
      betId: bet.id,
    });

    res.status(201).json({
      success: true,
      message: "Bet placed successfully",
      bet,
      newBalance: user.wallet,
    });
  } catch (error) {
    onError(res, error);
  }
};

// Get all bets for the authenticated user
export const getBets = async (req, res) => {
  const userId = req.user.id;
  const { status } = req.query; // Optional filter by status

  try {
    const query = { user: userId };
    if (status && ["pending", "won", "lost", "cancelled"].includes(status)) {
      query.status = status;
    }

    const bets = await BetModel.find(query)
      .sort({ placedAt: -1 })
      .populate("user", "username email");

    res.status(200).json({
      success: true,
      message: "Bets fetched successfully",
      bets,
      count: bets.length,
    });
  } catch (error) {
    onError(res, error);
  }
};

// Get a single bet by ID
export const getBetById = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const bet = await BetModel.findOne({ _id: id, user: userId }).populate(
      "user",
      "username email"
    );

    if (!bet) {
      return res.status(404).json({
        success: false,
        message: "Bet not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Bet fetched successfully",
      bet,
    });
  } catch (error) {
    onError(res, error);
  }
};

// Update bet status (typically for admin use, but can be used for cancellation)
export const updateBetStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const userId = req.user.id;

  try {
    if (!status || !["pending", "won", "lost", "cancelled"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Valid status is required (pending, won, lost, cancelled)",
      });
    }

    const bet = await BetModel.findOne({ _id: id, user: userId });
    if (!bet) {
      return res.status(404).json({
        success: false,
        message: "Bet not found",
      });
    }

    // If bet is already settled, don't allow changes unless cancelling
    if (bet.status !== "pending" && status !== "cancelled") {
      return res.status(400).json({
        success: false,
        message: "Cannot change status of a settled bet",
      });
    }

    const oldStatus = bet.status;
    bet.status = status;
    bet.settledAt = status !== "pending" ? new Date() : undefined;

    // Handle wallet updates based on status change
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // If cancelling a pending bet, refund the stake
    if (status === "cancelled" && oldStatus === "pending") {
      user.wallet += bet.stake;
    }
    // If bet is won, add potential win to wallet
    else if (status === "won" && oldStatus === "pending") {
      user.wallet += bet.potentialWin;
    }
    // If bet is lost, nothing happens (stake already deducted)

    await bet.save();
    await user.save();

    res.status(200).json({
      success: true,
      message: "Bet status updated successfully",
      bet,
      newBalance: user.wallet,
    });
  } catch (error) {
    onError(res, error);
  }
};

// Cancel a pending bet (user can cancel their own pending bets)
export const cancelBet = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const bet = await BetModel.findOne({ _id: id, user: userId });
    if (!bet) {
      return res.status(404).json({
        success: false,
        message: "Bet not found",
      });
    }

    if (bet.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: "Only pending bets can be cancelled",
      });
    }

    // Refund stake to user
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    bet.status = "cancelled";
    bet.settledAt = new Date();
    user.wallet += bet.stake;

    await bet.save();
    await user.save();

    res.status(200).json({
      success: true,
      message: "Bet cancelled successfully",
      bet,
      newBalance: user.wallet,
    });
  } catch (error) {
    onError(res, error);
  }
};

