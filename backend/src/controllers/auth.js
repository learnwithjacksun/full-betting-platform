import process from "process";
import generateRandomNumber from "../utils/generateRandomNumbers.js";
import { onError } from "../utils/onError.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import envFile from "../config/env.js";
import UserModel from "../model/user.js";
import sendEmail from "../config/email.js";
import { welcomeEmail } from "../template/welcomeEmail.js";

export const register = async (req, res) => {
  const { username, email, phone, password } = req.body;

  try {
    // Validate required fields
    if (!username || !email || !phone || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Check if user already exists
    const existingUserByEmail = await UserModel.findOne({ email });
    if (existingUserByEmail) {
      return res.status(400).json({
        success: false,
        message: "User with this email already exists",
      });
    }

    const existingUserByUsername = await UserModel.findOne({ username });
    if (existingUserByUsername) {
      return res.status(400).json({
        success: false,
        message: "Username already taken",
      });
    }

    const existingUserByPhone = await UserModel.findOne({ phone });
    if (existingUserByPhone) {
      return res.status(400).json({
        success: false,
        message: "User with this phone number already exists",
      });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Generate 6-digit OTP for email verification
    const otp = generateRandomNumber(6);
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Create user
    const user = await UserModel.create({
      username,
      email,
      phone,
      password: passwordHash,
      wallet: 0,
      otp,
      otpExpiresAt,
      isVerified: false,
    });

    // Send welcome email with OTP
    try {
      await sendEmail(
        "Welcome to Protection Pool - Verify Your Email",
        welcomeEmail({
          username: user.username,
          email: user.email,
          otp: otp,
        }),
        user.email,
        user.username
      );
    } catch (emailError) {
      console.error("Failed to send welcome email:", emailError);
      // Continue even if email fails
    }

    // Generate JWT token (user can use this to verify OTP)
    const token = jwt.sign({ id: user.id }, envFile.JWT_SECRET, {
      expiresIn: "7d",
    });

    // Set cookie with token
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully. Please check your email for verification code.",
      user,
    });
  } catch (error) {
    onError(res, error);
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Check if email is verified
    if (!user.isVerified) {
      return res.status(403).json({
        success: false,
        message: "Please verify your email address before logging in",
        requiresVerification: true,
      });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user.id }, envFile.JWT_SECRET, {
      expiresIn: "7d",
    });

    // Set cookie with token
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(200).json({
      success: true,
      message: "Login successful",
      user,
    });
  } catch (error) {
    onError(res, error);
  }
};

export const checkAuth = async (req, res) => {
  const user = req.user;
  res.status(200).json({
    success: true,
    message: "User authenticated",
    user,
  });
};

export const logout = async (req, res) => {
  res.clearCookie("token");
  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
};

export const adminLogin = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required" });
  }
  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }
    if (!user.isAdmin) {
      return res.status(401).json({
        message: "Unauthorized, you are not an admin",
        success: false,
      });
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid password" });
    }
    const token = jwt.sign({ id: user.id }, envFile.JWT_SECRET, {
      expiresIn: "1d",
    });
    
    // Set cookie with token
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });
    
    res.status(200).json({
      success: true,
      message: "Admin login successful",
      user,
    });
  } catch (error) {
    onError(res, error);
  }
};

export const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  try {
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Current password and new password are required",
      });
    }

    const user = await UserModel.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const isPasswordCorrect = bcrypt.compareSync(
      currentPassword,
      user.password
    );
    if (!isPasswordCorrect) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);
    user.password = passwordHash;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    onError(res, error);
  }
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const user = await UserModel.findOne({ email });
    if (!user) {
      // Don't reveal if email exists for security
      return res.status(200).json({
        success: true,
        message: "If email exists, a password reset link will be sent",
      });
    }

    // Generate reset token (in production, use a more secure token)
    const resetToken = jwt.sign({ id: user.id }, envFile.JWT_SECRET, {
      expiresIn: "1h",
    });

    user.secretKey = resetToken;
    user.secretKeyExpiresAt = new Date(Date.now() + 3600000); // 1 hour
    await user.save();

    // In production, send email with reset link
    // For now, just return success (you can integrate with email service)
    res.status(200).json({
      success: true,
      message: "If email exists, a password reset link will be sent",
      // In development, you might want to return the token for testing
      // resetToken: resetToken, // Remove in production
    });
  } catch (error) {
    onError(res, error);
  }
};

export const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    if (!token || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Token and new password are required",
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, envFile.JWT_SECRET);
    } catch (error) {
      onError(res, error);
    }

    const user = await UserModel.findById(decoded.id);
    if (!user || user.secretKey !== token) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired token",
      });
    }

    if (user.secretKeyExpiresAt && new Date() > user.secretKeyExpiresAt) {
      return res.status(400).json({
        success: false,
        message: "Token has expired",
      });
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);
    user.password = passwordHash;
    user.secretKey = undefined;
    user.secretKeyExpiresAt = undefined;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    onError(res, error);
  }
};

// Verify OTP
export const verifyOtp = async (req, res) => {
  const { otp } = req.body;
  const userId = req.user?.id;

  try {
    if (!otp || otp.length !== 6) {
      return res.status(400).json({
        success: false,
        message: "Valid 6-digit OTP is required",
      });
    }

    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.isVerified) {
      return res.status(400).json({
        success: false,
        message: "Email is already verified",
      });
    }

    if (!user.otp || user.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    if (!user.otpExpiresAt || new Date() > user.otpExpiresAt) {
      return res.status(400).json({
        success: false,
        message: "OTP has expired. Please request a new one.",
      });
    }

    // Verify the user
    user.isVerified = true;
    user.otp = undefined;
    user.otpExpiresAt = undefined;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Email verified successfully",
      user,
    });
  } catch (error) {
    onError(res, error);
  }
};

// Resend OTP
export const resendOtp = async (req, res) => {
  const userId = req.user?.id;

  try {
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.isVerified) {
      return res.status(400).json({
        success: false,
        message: "Email is already verified",
      });
    }

    // Generate new 6-digit OTP
    const otp = generateRandomNumber(6);
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    user.otp = otp;
    user.otpExpiresAt = otpExpiresAt;
    await user.save();

    // Send email with new OTP
    try {
      await sendEmail(
        "Protection Pool - New Verification Code",
        welcomeEmail({
          username: user.username,
          email: user.email,
          otp: otp,
        }),
        user.email,
        user.username
      );
    } catch (emailError) {
      console.error("Failed to send OTP email:", emailError);
      return res.status(500).json({
        success: false,
        message: "Failed to send verification email. Please try again.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Verification code sent to your email",
    });
  } catch (error) {
    onError(res, error);
  }
};
