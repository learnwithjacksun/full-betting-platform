import { onError } from "../utils/onError.js";
import TransactionModel from "../model/transaction.js";
import UserModel from "../model/user.js";
import generateRandomNumber from "../utils/generateRandomNumbers.js";

/**
 * Create a transaction (internal helper function)
 */
export const createTransaction = async ({
  userId,
  type,
  amount,
  description,
  status = "pending",
  reference,
  bankAccount,
  betId,
  paymentReference,
}) => {
  const transaction = await TransactionModel.create({
    user: userId,
    type,
    amount,
    description,
    status,
    reference: reference || `TXN-${Date.now()}-${generateRandomNumber(6)}`,
    bankAccount,
    betId,
    paymentReference,
  });
  return transaction;
};

/**
 * Get user's transaction history
 */
export const getTransactions = async (req, res) => {
  const userId = req.user.id;
  const { type, status, limit = 50, page = 1 } = req.query;

  try {
    const query = { user: userId };

    // Filter by type if provided
    if (type && ["deposit", "withdrawal", "bet", "bet_win", "bet_refund"].includes(type)) {
      query.type = type;
    }

    // Filter by status if provided
    if (status && ["pending", "completed", "failed", "cancelled"].includes(status)) {
      query.status = status;
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const transactions = await TransactionModel.find(query)
      .sort({ createdAt: -1 })
      .limit(limitNum)
      .skip(skip)
      .populate("betId", "betId stake totalOdds")
      .populate("processedBy", "username email");

    const total = await TransactionModel.countDocuments(query);

    res.status(200).json({
      success: true,
      message: "Transactions fetched successfully",
      transactions,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    onError(res, error);
  }
};

/**
 * Get a single transaction by ID
 */
export const getTransactionById = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const transaction = await TransactionModel.findOne({
      _id: id,
      user: userId,
    })
      .populate("betId", "betId stake totalOdds")
      .populate("processedBy", "username email");

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Transaction fetched successfully",
      transaction,
    });
  } catch (error) {
    onError(res, error);
  }
};

/**
 * Approve withdrawal transaction (Admin only)
 * This will mark the withdrawal as completed and deduct from user's wallet
 */
export const approveWithdrawal = async (req, res) => {
  const { id } = req.params;
  const adminId = req.user.id;

  try {
    const transaction = await TransactionModel.findById(id).populate("user");
    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found",
      });
    }

    if (transaction.type !== "withdrawal") {
      return res.status(400).json({
        success: false,
        message: "Only withdrawal transactions can be approved",
      });
    }

    if (transaction.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: `Transaction is already ${transaction.status}`,
      });
    }

    // Mark transaction as completed
    // Note: Amount is already deducted from wallet when withdrawal is requested
    // This endpoint just marks it as processed by admin
    transaction.status = "completed";
    transaction.processedBy = adminId;
    transaction.processedAt = new Date();
    await transaction.save();

    res.status(200).json({
      success: true,
      message: "Withdrawal approved successfully",
      transaction,
    });
  } catch (error) {
    onError(res, error);
  }
};

/**
 * Cancel withdrawal transaction (Admin only)
 */
export const cancelWithdrawal = async (req, res) => {
  const { id } = req.params;
  const adminId = req.user.id;

  try {
    const transaction = await TransactionModel.findById(id).populate("user");
    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found",
      });
    }

    if (transaction.type !== "withdrawal") {
      return res.status(400).json({
        success: false,
        message: "Only withdrawal transactions can be cancelled",
      });
    }

    if (transaction.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: `Transaction is already ${transaction.status}`,
      });
    }

    const user = await UserModel.findById(transaction.user._id || transaction.user);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Mark transaction as cancelled
    transaction.status = "cancelled";
    transaction.processedBy = adminId;
    transaction.processedAt = new Date();
    await transaction.save();

    // Refund to user wallet (if amount was already deducted)
    user.wallet += transaction.amount;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Withdrawal cancelled and refunded successfully",
      transaction,
    });
  } catch (error) {
    onError(res, error);
  }
};

