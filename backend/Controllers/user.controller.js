import Listing from "../models/listing.model.js";
import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";
import bcryptjs from "bcryptjs";

export const test = (req, res) => {
  res.json({
    Hello: "Api route is working",
  });
};

export const updateUser = async (req, res, next) => {
  const { username, email, avatar } = req?.body;
  if (req?.user?.id !== req?.params?.id)
    return next(errorHandler(401, "You can only update your own account!"));
  try {
    if (req.body.password) {
      req.body.password = bcryptjs.hashSync(req.body.password, 10);
    }

    const UpdatedUser = await User.findByIdAndUpdate(
      req?.params?.id,
      {
        // this will help to set those data which user wants to save
        $set: {
          username,
          email,
          password: req?.body?.password,
          avatar,
        },
      },
      // this will return and save the updated user from the new information.
      { new: true }
    );

    const { password, ...rest } = UpdatedUser?._doc;

    res?.status(200)?.json(rest);
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  if (req?.user?.id !== req?.params?.id)
    return next(errorHandler(401, "You can only update your own account!"));

  try {
    await User.findByIdAndDelete(req?.params?.id);
    res.clearCookie("access_token");
    res.status(200).json("User has been deleted!");
  } catch (error) {
    next(error);
  }
};

export const getUserListing = async (req, res, next) => {
  if (req?.user?.id === req?.params?.id) {
    try {
      const listings = await Listing.find({ userRef: req.params.id });
      res.set(
        "Cache-Control",
        "no-store, no-cache, must-revalidate, proxy-revalidate"
      );
      res.set("Pragma", "no-cache");
      res.set("Expires", "0");
      res.status(200).json(listings);
    } catch (error) {
      next(error);
    }
  } else {
    return next(errorHandler(401, "You can only view your own listings!"));
  }
};

export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return next(errorHandler(404, "User not found"));

    const { password: pass, ...rest } = user?._doc;
    res.set(
      "Cache-Control",
      "no-store, no-cache, must-revalidate, proxy-revalidate"
    );
    res.set("Pragma", "no-cache");
    res.set("Expires", "0");
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};
