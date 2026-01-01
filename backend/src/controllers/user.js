import { onError } from "../utils/onError.js";
import UserModel from "../model/user.js";
import TransactionModel from "../model/transaction.js";
import { createTransaction } from "./transaction.js";

// Get current user profile
export const getProfile = async (req, res) => {
  try {
    const user = await UserModel.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Profile fetched successfully",
      user,
    });
  } catch (error) {
    onError(res, error);
  }
};

// Get wallet balance
export const getWallet = async (req, res) => {
  try {
    const user = await UserModel.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Wallet balance fetched successfully",
      balance: user.wallet,
    });
  } catch (error) {
    onError(res, error);
  }
};

export const updateProfile = async (req, res) => {
  const { username, email, phone } = req.body;

  try {
    const user = await UserModel.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check if username is being changed and if it's already taken
    if (username && username !== user.username) {
      const existingUser = await UserModel.findOne({ username });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "Username already taken",
        });
      }
      user.username = username;
    }

    // Check if email is being changed and if it's already taken
    if (email && email !== user.email) {
      const existingUser = await UserModel.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "Email already in use",
        });
      }
      user.email = email;
      // Reset verification status if email changes
      user.isVerified = false;
    }

    // Check if phone is being changed and if it's already taken
    if (phone && phone !== user.phone) {
      const existingUser = await UserModel.findOne({ phone });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "Phone number already in use",
        });
      }
      user.phone = phone;
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    onError(res, error);
  }
};

// Deposit callback - called when Paystack payment is successful
export const depositCallback = async (req, res) => {
  const { reference, amount, email } = req.body;

  try {
    if (!reference || !amount) {
      return res.status(400).json({
        success: false,
        message: "Reference and amount are required",
      });
    }

    // Find user by email
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check if transaction already exists (prevent duplicate)
    const existingTransaction = await TransactionModel.findOne({ reference });
    if (existingTransaction) {
      return res.status(200).json({
        success: true,
        message: "Transaction already processed",
        transaction: existingTransaction,
      });
    }

    // Credit user wallet
    user.wallet += amount;
    await user.save();

    // Create transaction
    const transaction = await createTransaction({
      userId: user.id,
      type: "deposit",
      amount,
      description: `Deposit of ₦${amount.toLocaleString()}`,
      status: "completed",
      reference,
      paymentReference: reference,
    });

    res.status(200).json({
      success: true,
      message: "Deposit processed successfully",
      transaction,
      newBalance: user.wallet,
    });
  } catch (error) {
    onError(res, error);
  }
};

// Request withdrawal
export const requestWithdrawal = async (req, res) => {
  const { amount, bankAccountId } = req.body;
  const userId = req.user.id;

  try {
    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Valid amount is required",
      });
    }

    if (amount < 100) {
      return res.status(400).json({
        success: false,
        message: "Minimum withdrawal amount is ₦100",
      });
    }

    if (!bankAccountId) {
      return res.status(400).json({
        success: false,
        message: "Bank account is required",
      });
    }

    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.wallet < amount) {
      return res.status(400).json({
        success: false,
        message: "Insufficient balance",
      });
    }

    // Find bank account
    const bankAccount = user.bankAccounts.find(
      (acc) => acc.id.toString() === bankAccountId
    );
    if (!bankAccount) {
      return res.status(404).json({
        success: false,
        message: "Bank account not found",
      });
    }

    // Deduct from wallet immediately
    user.wallet -= amount;
    await user.save();

    // Create pending withdrawal transaction
    const transaction = await createTransaction({
      userId: user.id,
      type: "withdrawal",
      amount,
      description: `Withdrawal of ₦${amount.toLocaleString()} to ${bankAccount.bankName} - ${bankAccount.accountNumber}`,
      status: "pending",
      bankAccount: {
        bankName: bankAccount.bankName,
        accountNumber: bankAccount.accountNumber,
        accountName: bankAccount.accountName,
        bankCode: bankAccount.bankCode,
      },
    });

    res.status(201).json({
      success: true,
      message: "Withdrawal request submitted successfully. It will be processed by admin.",
      transaction,
      newBalance: user.wallet,
    });
  } catch (error) {
    onError(res, error);
  }
};

