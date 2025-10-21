import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import chatReducer from "./chatSlice";

const store = configureStore({
  reducer: {
    // Add your reducers here
    auth: authReducer,
    chat: chatReducer,
  },
});

export default store;
