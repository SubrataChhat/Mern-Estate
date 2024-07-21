import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";

export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;
  const hashedPassword = bcryptjs.hashSync(password, 10);
  const newUser = new User({ username, email, password: hashedPassword });
  try {
    await newUser.save();
    res.status(201).json({ message: "User created successfully!" });
  } catch (error) {
    // next(errorHandler(550, "error from the function"));
    next(error);
  }
};

export const signin = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    // this will check for if the email is exists or not
    const validUser = await User.findOne({ email });
    if (!validUser) return next(errorHandler(404, "User not found"));
    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) return next(errorHandler(401, "Wrong Credentials!"));
    const token = jwt.sign({ id: validUser?._id }, process.env.JWT_SECRET);

    // we don't want other or users to show their password after login so do this to hide the password
    const { password: pass, ...restData } = validUser?._doc;
    res
      .cookie("access_token", token, { httpOnly: true })
      .status(200)
      .json(restData);
  } catch (error) {
    next(error);
  }
};

export const google = async (req, res, next) => {
  try {
    const userExists = await User.findOne({ email: req.body.email });
    if (userExists) {
      const token = jwt.sign({ id: userExists?._id }, process.env.JWT_SECRET);
      const { password: pass, ...rest } = userExists?._doc;
      res
        .cookie("access_token", token, { httpOnly: true })
        .status(200)
        .json(rest);
    } else {
      // for creating 16 digits password
      const generatedPassword =
        // toString will create password from A-Z and 0-9 and with slice we are getting the it's last 8 digits
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
      const newUser = new User({
        username:
          req.body.name.split(" ").join("").toLowerCase() +
          Math.random().toString(36).slice(-4),
        email: req?.body?.email,
        password: hashedPassword,
        avatar: req?.body?.photo,
      });
      await newUser.save();
      const token = jwt.sign({ id: newUser?._id }, process.env.JWT_SECRET);
      const { password: pass, ...rest } = newUser?._doc;
      res
        .cookie("access_token", token, { httpOnly: true })
        .status(200)
        .json(rest);
    }
  } catch (error) {
    next(error);
  }
};
