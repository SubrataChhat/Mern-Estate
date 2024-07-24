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
