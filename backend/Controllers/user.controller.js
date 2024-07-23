import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";
import bcryptjs from "bcryptjs";

export const test = (req, res) => {
  res.json({
    Hello: "Api route is working",
  });
};

export const updateUser = async (req, res, next) => {
  const { username, email, password, avatar } = req?.body;
  if (req?.user?.id !== req?.params?.id)
    return next(errorHandler(401, "You can only update your own account!"));
  try {
    if (password) {
      password = bcryptjs.hashSync(password, 10);
    }

    const UpdatedUser = await User.findByIdAndUpdate(
      req?.params?.id,
      {
        // this will help to set those data which user wants to save
        $set: {
          username,
          email,
          password,
          avatar,
        },
      },
      // this will return and save the updated user from the new information.
      { new: true }
    );

    const { password: pass, ...rest } = UpdatedUser?._doc;

    res?.status(200)?.json({ rest });
  } catch (error) {
    next(error);
  }
};
