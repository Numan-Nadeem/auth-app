import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.model.js";
import Token from "../models/Token.model.js";
import {
  ACCESS_TOKEN_EXPIRY,
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_EXPIRY,
  REFRESH_TOKEN_SECRET,
} from "../config/env.js";
import { AppError } from "../middlewares/error.middleware.js";

/* -------------------------------------------------------------------------- */
/*                            Helper: Token Generators                        */
/* -------------------------------------------------------------------------- */

const generateAccessToken = (userId) =>
  jwt.sign({ userId }, ACCESS_TOKEN_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRY,
  });

const generateRefreshToken = (userId) =>
  jwt.sign({ userId }, REFRESH_TOKEN_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRY,
  });

/* -------------------------------------------------------------------------- */
/*                            Helper: Cookie Options                          */
/* -------------------------------------------------------------------------- */

const cookieOptions = {
  httpOnly: true,
  secure: false,
  sameSite: "Strict",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

/* -------------------------------------------------------------------------- */
/*                          Helper: Save Refresh Token                        */
/* -------------------------------------------------------------------------- */

const saveRefreshToken = async (userId, refreshToken, session = null) => {
  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + 7);

  return await Token.create([{ userId, refreshToken, expiresAt: expiryDate }], {
    session,
  });
};

/* -------------------------------------------------------------------------- */
/*                                  Signup                                    */
/* -------------------------------------------------------------------------- */

export const signup = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { firstName, email, password } = req.body;

    const existingUser = await User.findOne({ email }).session(session);
    if (existingUser) throw new AppError("Email already exists!", 400);

    const hashedPassword = await bcrypt.hash(password, 10);

    const [newUser] = await User.create(
      [{ firstName, email, password: hashedPassword }],
      { session }
    );

    const accessToken = generateAccessToken(newUser._id);
    const refreshToken = generateRefreshToken(newUser._id);

    await saveRefreshToken(newUser._id, refreshToken, session);
    await session.commitTransaction();

    res
      .status(201)
      .cookie("jwt", refreshToken, cookieOptions)
      .json({
        success: true,
        message: "User registered successfully!",
        user: {
          id: newUser._id,
          firstName: newUser.firstName,
          email: newUser.email,
        },
        accessToken,
      });
  } catch (error) {
    await session.abortTransaction();
    next(error);
  } finally {
    session.endSession();
  }
};

/* -------------------------------------------------------------------------- */
/*                                   Login                                    */
/* -------------------------------------------------------------------------- */

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) throw new AppError("User not found!", 404);

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) throw new AppError("Invalid email or password!", 401);

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    await saveRefreshToken(user._id, refreshToken);

    res
      .status(200)
      .cookie("jwt", refreshToken, cookieOptions)
      .json({
        success: true,
        message: "Login successful!",
        user: {
          id: user._id,
          firstName: user.firstName,
          email: user.email,
        },
        accessToken,
      });
  } catch (error) {
    next(error);
  }
};

/* -----------------------------------------------------------------------------*/
/*                                   Refresh                                    */
/* -----------------------------------------------------------------------------*/

export const refresh = async (req, res, next) => {
  try {
    const refreshToken = req.cookies?.jwt;
    if (!refreshToken) throw new AppError("No refresh token provided!", 401);

    const storedToken = await Token.findOne({ refreshToken });
    if (!storedToken)
      throw new AppError("Invalid or expired refresh token!", 403);

    const decoded = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);

    if (decoded.userId.toString() !== storedToken.userId.toString())
      throw new AppError("Token does not match the user!", 403);

    const newAccessToken = generateAccessToken(decoded.userId);

    res.status(200).json({
      success: true,
      message: "Access token refreshed successfully!",
      accessToken: newAccessToken,
    });
  } catch (err) {
    next(err);
  }
};

/* -----------------------------------------------------------------------------*/
/*                                    Logout                                    */
/* -----------------------------------------------------------------------------*/

export const logout = async (req, res, next) => {
  try {
    const refreshToken = req.cookies?.jwt;
    if (!refreshToken) return res.sendStatus(204);

    const deleted = await Token.findOneAndDelete({ refreshToken });
    res.clearCookie("jwt", cookieOptions);

    if (!deleted) return res.sendStatus(204);

    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    next(new AppError("Logout failed", 500));
  }
};

//////////////////////////////////////////////////////////////////////////////////////
