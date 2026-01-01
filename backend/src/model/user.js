import { Schema, model } from "mongoose";

const bankAccountSchema = new Schema({
  bankName: {
    type: String,
    required: true,
  },
  accountNumber: {
    type: String,
    required: true,
  },
  accountName: {
    type: String,
    required: true,
  },
  bankCode: {
    type: String,
    required: true,
  },
  isDefault: {
    type: Boolean,
    required: true,
    default: false,
  },
},{
  timestamps: true,
  toJSON: {
    transform: function (doc, ret) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      return ret;
    },
  },
});

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    wallet: {
      type: Number,
      required: true,
      default: 0,
    },
    bankAccounts: {
      type: [bankAccountSchema],
      required: false,
      default: [],
    },
    isAdmin: {
      type: Boolean,
      required: false,
      default: false,
    },
    otp: {
      type: String,
      required: false,
    },
    otpExpiresAt: {
      type: Date,
      required: false,
    },
    secretKey: {
      type: String,
      required: false,
    },
    secretKeyExpiresAt: {
      type: Date,
      required: false,
    },
    isVerified: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        delete ret.password;
        delete ret.otp;
        delete ret.otpExpiresAt;
        delete ret.secretKey;
        delete ret.secretKeyExpiresAt;
        return ret;
      },
    },
  }
);

const UserModel = model("User", userSchema);

export default UserModel;
