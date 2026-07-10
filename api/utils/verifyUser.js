import jwt from "jsonwebtoken";
import { errorHandler } from "../utils/error.js";

export const verifyToken = (req, res, next) => {
  // console.log("All cookies received:", req.cookies);
  const token = req.cookies.token;
  // console.log("Token from cookies:", token);

  if (!token) return next(errorHandler(401, "Unauthorized."));

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.log("JWT verification error:", err.message);
      return next(errorHandler(403, "Forbidden."));
    }

    console.log("JWT verified successfully for user:", user.id);
    req.user = user;
    next();
  });
};
