import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoggedIn: localStorage.getItem("token") ? true : false,
  token: localStorage.getItem("token") || null,
  expiresIn: localStorage.getItem("expiresIn") || null,
  name: localStorage.getItem("name") || null,
  position: localStorage.getItem("position") || null,
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
      localStorage.setItem("token", action.payload.token);
      localStorage.setItem("expiresIn", action.payload.expiresIn);
      localStorage.setItem("name", action.payload.name);
      localStorage.setItem("position", action.payload.position);
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
