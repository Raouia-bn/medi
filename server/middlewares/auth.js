import { catchAsyncErrors } from "./catchAsyncErrors.js";
import ErrorHandler from "./error.js";
import jwt from "jsonwebtoken";
import { User } from "../models/userSchema.js";

export const isAuthenticated = catchAsyncErrors(async (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1]; // Récupère le token à partir des en-têtes
  if (!token) {
    return next(new ErrorHandler("User is not authenticated.", 400));
  }
  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
  req.user = await User.findById(decoded.id);
  next();
});

export const isAuthorized = (role) => {
  return (req, res, next) => {
    if (req.user.role !== role) {
      return res.status(403).json({ message: "Access denied." });
    }
    next();
  };
};

