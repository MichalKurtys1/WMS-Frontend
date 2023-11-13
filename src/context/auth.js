import { createSlice } from "@reduxjs/toolkit";
import { decryptData, encryptData } from "../utils/dataEncryption";

const initialState = {
  isLoggedIn: decryptData("token"),
  token: decryptData("token"),
  expiresIn: decryptData("expiresIn"),
  name: decryptData("name"),
  position: decryptData("position"),
};

const authSlice = createSlice({
  name: "authentication",
  initialState,
  reducers: {
    logIn(state, action) {
      state.isLoggedIn = true;
      state.token = action.payload.token;
      state.expiresIn = action.payload.expiresIn;
      state.name = action.payload.name;
      state.position = action.payload.position;
      encryptData("token", action.payload.token);
      encryptData("expiresIn", action.payload.expiresIn);
      encryptData("name", action.payload.name);
      encryptData("position", action.payload.position);
    },
    logOut(state, action) {
      state.isLoggedIn = false;
      state.token = null;
      state.expiresIn = null;
      state.name = null;
      state.position = null;
      localStorage.removeItem("token");
      localStorage.removeItem("expiresIn");
      localStorage.removeItem("name");
      localStorage.removeItem("position");
    },
  },
});

export default authSlice.reducer;
export const authActions = authSlice.actions;
