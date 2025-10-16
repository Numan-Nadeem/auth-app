import jwt from "jsonwebtoken";
import { ACCESS_TOKEN_SECRET } from "../config/env.js";

const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token)
      return res.status(401).json({
        success: false,
        message: "Access denied. Please login and try again!",
      });

    const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET);

    req.user = decoded;
    next();
  } catch (error) {
    return res
      .status(403)
      .json({ success: false, message: "Authorization failed!" });
  }
};

export default verifyToken;
