import { Router } from "express";
import UserModel from "../model/user.js";
import BetModel from "../model/bets.js";
import TransactionModel from "../model/transaction.js";
import MatchModel from "../model/matches.js";
import authMiddleware from "../middleware/auth.middleware.js";
import isAdmin from "../middleware/admin.middleware.js";
import { onError } from "../utils/onError.js";

const adminRouter = Router();

// All admin routes require authentication and admin role
adminRouter.use(authMiddleware);
adminRouter.use(isAdmin);

// Get all users
adminRouter.get("/users", async (req, res) => {
  try {
    const users = await UserModel.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      message: "Users fetched successfully",
      users,
    });
  } catch (error) {
    onError(res, error);
  }
});

// Get single user by ID
adminRouter.get("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const user = await UserModel.findById(id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Get user's bets
    const bets = await BetModel.find({ user: id })
      .sort({ placedAt: -1 })
      .limit(10);

    // Get user's transactions
    const transactions = await TransactionModel.find({ user: id })
      .sort({ createdAt: -1 })
      .limit(10);

    res.status(200).json({
      success: true,
      message: "User fetched successfully",
      user,
      bets,
      transactions,
    });
  } catch (error) {
    onError(res, error);
  }
});

// Get all bets
adminRouter.get("/bets", async (req, res) => {
  try {
    const { status } = req.query;
    const query = {};
    if (status && ["pending", "won", "lost", "cancelled"].includes(status)) {
      query.status = status;
    }
    const bets = await BetModel.find(query)
      .populate("user", "username email")
      .sort({ placedAt: -1 });
    res.status(200).json({
      success: true,
      message: "Bets fetched successfully",
      bets,
      count: bets.length,
    });
  } catch (error) {
    onError(res, error);
  }
});

// Update bet status (admin only)
adminRouter.patch("/bets/:id/status", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    if (!status || !["pending", "won", "lost", "cancelled"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Valid status is required",
      });
    }

    const bet = await BetModel.findById(id).populate("user");
    if (!bet) {
      return res.status(404).json({
        success: false,
        message: "Bet not found",
      });
    }

    const oldStatus = bet.status;
    bet.status = status;
    bet.settledAt = status !== "pending" ? new Date() : undefined;

    // Handle wallet updates
    const user = await UserModel.findById(bet.user._id);
    if (user) {
      if (status === "cancelled" && oldStatus === "pending") {
        user.wallet += bet.stake;
      } else if (status === "won" && oldStatus === "pending") {
        user.wallet += bet.potentialWin;
      }
      await user.save();
    }

    await bet.save();

    res.status(200).json({
      success: true,
      message: "Bet status updated successfully",
      bet,
    });
  } catch (error) {
    onError(res, error);
  }
});

// Get dashboard stats
adminRouter.get("/stats", async (req, res) => {
  try {
    // Get total users count
    const totalUsers = await UserModel.countDocuments();

    // Get total bets count
    const totalBets = await BetModel.countDocuments();

    // Get bets by status
    const pendingBets = await BetModel.countDocuments({ status: "pending" });
    const wonBets = await BetModel.countDocuments({ status: "won" });
    const lostBets = await BetModel.countDocuments({ status: "lost" });
    const cancelledBets = await BetModel.countDocuments({ status: "cancelled" });

    // Get total transactions count
    const totalTransactions = await TransactionModel.countDocuments();

    // Get transactions by type
    const deposits = await TransactionModel.countDocuments({ type: "deposit", status: "completed" });
    const withdrawals = await TransactionModel.countDocuments({ type: "withdrawal" });
    const pendingWithdrawals = await TransactionModel.countDocuments({
      type: "withdrawal",
      status: "pending",
    });

    // Get total matches count
    const totalMatches = await MatchModel.countDocuments();

    // Get matches by status
    const upcomingMatches = await MatchModel.countDocuments({ status: "upcoming" });
    const liveMatches = await MatchModel.countDocuments({ status: "live" });
    const finishedMatches = await MatchModel.countDocuments({ status: "finished" });

    // Calculate total deposit amount
    const depositTransactions = await TransactionModel.find({
      type: "deposit",
      status: "completed",
    });
    const totalDeposits = depositTransactions.reduce(
      (sum, transaction) => sum + transaction.amount,
      0
    );

    // Calculate total withdrawal amount
    const withdrawalTransactions = await TransactionModel.find({
      type: "withdrawal",
      status: "completed",
    });
    const totalWithdrawals = withdrawalTransactions.reduce(
      (sum, transaction) => sum + transaction.amount,
      0
    );

    // Calculate total pending withdrawal amount
    const pendingWithdrawalTransactions = await TransactionModel.find({
      type: "withdrawal",
      status: "pending",
    });
    const totalPendingWithdrawals = pendingWithdrawalTransactions.reduce(
      (sum, transaction) => sum + transaction.amount,
      0
    );

    // Get recent users (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentUsers = await UserModel.countDocuments({
      createdAt: { $gte: sevenDaysAgo },
    });

    // Get recent bets (last 7 days)
    const recentBets = await BetModel.countDocuments({
      placedAt: { $gte: sevenDaysAgo },
    });

    res.status(200).json({
      success: true,
      message: "Stats fetched successfully",
      stats: {
        users: {
          total: totalUsers,
          recent: recentUsers,
        },
        bets: {
          total: totalBets,
          recent: recentBets,
          pending: pendingBets,
          won: wonBets,
          lost: lostBets,
          cancelled: cancelledBets,
        },
        transactions: {
          total: totalTransactions,
          deposits: {
            count: deposits,
            totalAmount: totalDeposits,
          },
          withdrawals: {
            count: withdrawals,
            totalAmount: totalWithdrawals,
            pending: {
              count: pendingWithdrawals,
              totalAmount: totalPendingWithdrawals,
            },
          },
        },
        matches: {
          total: totalMatches,
          upcoming: upcomingMatches,
          live: liveMatches,
          finished: finishedMatches,
        },
      },
    });
  } catch (error) {
    onError(res, error);
  }
});

// Get all transactions (admin only)
adminRouter.get("/transactions", async (req, res) => {
  try {
    const { type, status } = req.query;
    const query = {};

    if (type && ["deposit", "withdrawal", "bet", "bet_win", "bet_refund"].includes(type)) {
      query.type = type;
    }

    if (status && ["pending", "completed", "failed", "cancelled"].includes(status)) {
      query.status = status;
    }

    const transactions = await TransactionModel.find(query)
      .populate("user", "username email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "Transactions fetched successfully",
      transactions,
      count: transactions.length,
    });
  } catch (error) {
    onError(res, error);
  }
});

// Get all withdrawals (admin only)
adminRouter.get("/withdrawals", async (req, res) => {
  try {
    const { status } = req.query;
    const query = { type: "withdrawal" };

    if (status && ["pending", "completed", "failed", "cancelled"].includes(status)) {
      query.status = status;
    }

    const withdrawals = await TransactionModel.find(query)
      .populate("user", "username email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "Withdrawals fetched successfully",
      withdrawals,
      count: withdrawals.length,
    });
  } catch (error) {
    onError(res, error);
  }
});

// Toggle user admin status (admin only)
adminRouter.patch("/users/:id/admin", async (req, res) => {
  try {
    const { id } = req.params;
    const { isAdmin } = req.body;

    if (typeof isAdmin !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "isAdmin must be a boolean value",
      });
    }

    const user = await UserModel.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Prevent removing admin status from yourself
    if (req.user.id === id && !isAdmin) {
      return res.status(400).json({
        success: false,
        message: "You cannot remove admin status from yourself",
      });
    }

    user.isAdmin = isAdmin;
    await user.save();

    res.status(200).json({
      success: true,
      message: `User admin status ${isAdmin ? "enabled" : "disabled"} successfully`,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin,
      },
    });
  } catch (error) {
    onError(res, error);
  }
});

// Update user wallet balance (admin only)
adminRouter.patch("/users/:id/wallet", async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, type, description } = req.body; // type: "add" or "subtract"

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Valid amount is required",
      });
    }

    if (!type || !["add", "subtract", "set"].includes(type)) {
      return res.status(400).json({
        success: false,
        message: "Type must be 'add', 'subtract', or 'set'",
      });
    }

    const user = await UserModel.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const oldBalance = user.wallet;
    
    if (type === "add") {
      user.wallet += amount;
    } else if (type === "subtract") {
      if (user.wallet < amount) {
        return res.status(400).json({
          success: false,
          message: "Insufficient balance",
        });
      }
      user.wallet -= amount;
    } else if (type === "set") {
      user.wallet = amount;
    }

    await user.save();

    // Create transaction record
    const transaction = await TransactionModel.create({
      user: id,
      type: type === "add" ? "deposit" : "bet",
      amount: type === "subtract" ? amount : amount,
      status: "completed",
      description: description || `Admin ${type === "add" ? "credited" : type === "subtract" ? "debited" : "set"} wallet: ₦${amount.toLocaleString()}`,
      processedBy: req.user.id,
      processedAt: new Date(),
    });

    res.status(200).json({
      success: true,
      message: "Wallet balance updated successfully",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        wallet: user.wallet,
      },
      oldBalance,
      newBalance: user.wallet,
      transaction,
    });
  } catch (error) {
    onError(res, error);
  }
});

export default adminRouter;
