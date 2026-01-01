import { Schema, model } from "mongoose";

const transactionSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: ["deposit", "withdrawal", "bet", "bet_win", "bet_refund"],
    },
    amount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: ["pending", "completed", "failed", "cancelled"],
      default: "pending",
    },
    description: {
      type: String,
      required: true,
    },
    reference: {
      type: String,
      required: false,
      unique: true,
      sparse: true, // Allow null/undefined but enforce uniqueness when present
    },
    bankAccount: {
      type: {
        bankName: String,
        accountNumber: String,
        accountName: String,
        bankCode: String,
      },
      required: false,
    },
    betId: {
      type: Schema.Types.ObjectId,
      ref: "Bet",
      required: false,
    },
    paymentReference: {
      type: String,
      required: false,
    },
    processedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    processedAt: {
      type: Date,
      required: false,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Index for faster queries
transactionSchema.index({ user: 1, createdAt: -1 });
transactionSchema.index({ status: 1, type: 1 });
transactionSchema.index({ reference: 1 });

const TransactionModel = model("Transaction", transactionSchema);

export default TransactionModel;

