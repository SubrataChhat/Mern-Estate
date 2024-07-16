import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./user/userSlice.js";

export const store = configureStore({
  reducer: {
    user: userReducer,
  },

  //   by this we are not gonna get any error for not serializing our variable
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
