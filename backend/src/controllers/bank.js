import { onError } from "../utils/onError.js";
import axios from "axios";
import process from "process";
import UserModel from "../model/user.js";

export const getSupportedBanks = async (req, res) => {
  try {
    const response = await axios.get(
      "https://api.paystack.co/bank?currency=NGN&enabled_for_verification=true",
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_BEARER_SECRET_KEY}`,
        },
      }
    );

    const banks = response.data.data;

    return res.status(200).json({
      success: true,
      message: "Supported banks fetched successfully",
      data: banks.map((bank) => ({
        name: bank.name,
        code: bank.code,
      })),
    });
  } catch (error) {
    console.error(
      "Paystack bank fetch error:",
      error?.response?.data || error.message
    );
    return res.status(500).json({
      success: false,
      message: "Failed to fetch supported banks",
      error: error?.response?.data || error.message,
    });
  }
};

/**
 * Resolve a bank account using Paystack
 */
export const resolveBankAccount = async (req, res) => {
  try {
    const { accountNumber, bankCode, bankName } = req.body;

    const response = await axios.get(
      `https://api.paystack.co/bank/resolve?account_number=${accountNumber}&bank_code=${bankCode}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_BEARER_SECRET_KEY}`,
        },
      }
    );

    const account = response.data.data;

    return res.status(200).json({
      success: true,
      message: "Bank account resolved successfully",
      data: {
        accountName: account.account_name,
        accountNumber: account.account_number,
        bankName,
        bankCode,
      },
    });
  } catch (error) {
    console.error(
      "Paystack resolve error:",
      error?.response?.data || error.message
    );
    return res.status(500).json({
      success: false,
      message: "Failed to resolve bank account",
      error: error?.response?.data || error.message,
    });
  }
};

/**
 * Get the user's bank account (single)
 */
export const getBankAccount = async (req, res) => {
  try {
    const { id: userId } = req.user;
    const bankAccount = await UserModel.findById(userId).select("bankAccounts");

    res.status(200).json({
      success: true,
      message: "Bank account fetched successfully",
      data: bankAccount?.bankAccounts || null,
    });
  } catch (error) {
    onError(res, error);
  }
};

/**
 * Add or update the user's bank account (only one allowed)
 */
export const addOrUpdateBankAccount = async (req, res) => {
  try {
    const { id: userId } = req.user;
    const { accountName, accountNumber, bankName, bankCode } = req.body;

    if (!accountName || !accountNumber || !bankName || !bankCode) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Add new bank account
    user.bankAccounts.push({
      accountName,
      accountNumber,
      bankName,
      bankCode,
      isDefault: user.bankAccounts.length === 0, // First account is default
    });
    
    await user.save();

    res.status(201).json({
      success: true,
      message: "Bank account added successfully",
      data: user.bankAccounts,
    });
  } catch (error) {
    onError(res, error);
  }
};

/**
 * Delete the user's bank account (soft delete)
 */
export const deleteBankAccount = async (req, res) => {
  try {
    const { id: userId } = req.user;
    const { id: bankAccountId } = req.params;
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const accountExists = user.bankAccounts.some(
      (account) => account.id.toString() === bankAccountId
    );
    if (!accountExists) {
      return res.status(404).json({
        success: false,
        message: "Bank account not found",
      });
    }

    // Remove the bank account
    user.bankAccounts = user.bankAccounts.filter(
      (account) => account.id.toString() !== bankAccountId
    );

    // If deleted account was default and there are other accounts, set first one as default
    if (user.bankAccounts.length > 0) {
      user.bankAccounts[0].isDefault = true;
    }

    await user.save();
    
    return res.status(200).json({
      success: true,
      message: "Bank account deleted successfully",
    });
  } catch (error) {
    onError(res, error);
  }
};
