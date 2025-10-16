import { AppError } from "../middlewares/error.middleware.js";
import User from "../models/User.model.js";

export const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId).select("-password");
    if (!user) throw new AppError("User not found", 404);

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};
