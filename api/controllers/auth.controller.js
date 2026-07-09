import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";

// SIGN UP Controller
export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return next(errorHandler(409, "User already exists"));

    const hashedPassword = bcryptjs.hashSync(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });

    await newUser.save();

    res
      .status(201)
      .json({ success: true, message: "User created successfully" });
  } catch (error) {
    next(error);
  }
};

// SIGN IN Controller
export const signin = async (req, res, next) => {
  const { email, password } = req.body;



  try {
    const validUser = await User.findOne({ email });
    if (!validUser) {
      return next(errorHandler(401, "Invalid email or password"));
    }

    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) {
      return next(errorHandler(401, "Invalid email or password"));
    }

    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    const { password: pass, ...rest } = validUser._doc;

    res
      .cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      })
      .status(200)
      .json({ success: true, ...rest });
  } catch (error) {
    next(error);
  }
};

// GOOGLE AUTH Controller
export const google = async (req, res, next) => {
  try {
    const { email, name, photo } = req.body;

    let user = await User.findOne({ email });

    const token = jwt.sign({ id: user?._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    if (user) {
      // Update avatar if missing or default
      if (
        !user.avatar ||
        user.avatar ===
          "https://pixabay.com/vectors/blank-profile-picture-mystery-man-973460/"
      ) {
        user.avatar = photo;
        await user.save();
      }

      const { password: pass, ...rest } = user._doc;

      return res
        .cookie("token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        })
        .status(200)
        .json({ success: true, ...rest });
    } else {
      // Create new user from Google
      const generatedPassword = Math.random().toString(36).slice(-8);
      const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);

      const newUser = new User({
        username:
          name.split(" ").join("").toLowerCase() +
          Math.floor(Math.random() * 10000),
        email,
        password: hashedPassword,
        avatar: photo,
        fromGoogle: true,
      });

      await newUser.save();

      const { password: pass, ...rest } = newUser._doc;

      return res
        .cookie("token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        })
        .status(201)
        .json({ success: true, ...rest });
    }
  } catch (error) {
    next(error);
  }
};

// SIGN OUT Controller
export const signout = async (req, res, next) => {
  try {
    res.clearCookie("token");
    res
      .status(200)
      .json({ success: true, message: "User has been logged out" });
  } catch (error) {
    next(error);
  }
};
