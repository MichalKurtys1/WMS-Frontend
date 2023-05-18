import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "authentication",
  initialState: {},
  reducers: {
    logIn(state, action) {
      state.isLoggedIn = true;
      state.token = action.payload.token;
      state.expiresIn = action.payload.expiresIn;
      state.nick = action.payload.nick;
      localStorage.setItem("token", action.payload.token);
      localStorage.setItem("expiresIn", action.payload.expiresIn);
      localStorage.setItem("nick", action.payload.nick);
    },
  },
});

export default authSlice.reducer;
export const authActions = authSlice.actions;
