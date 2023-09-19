import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth";

const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});

export default store;

export const getAuth = () => {
  const state = store.getState();
  return state.auth;
};
