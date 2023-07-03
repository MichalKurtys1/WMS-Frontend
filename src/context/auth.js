import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "authentication",
  initialState: { isLoggedIn: false, token: null, expiresIn: null, name: null },
  reducers: {
    logIn(state, action) {
      state.isLoggedIn = true;
      state.token = action.payload.token;
      state.expiresIn = action.payload.expiresIn;
      state.name = action.payload.name;
      localStorage.setItem("token", action.payload.token);
      localStorage.setItem("expiresIn", action.payload.expiresIn);
      localStorage.setItem("name", action.payload.name);
    },
    logOut(state, action) {
      state.isLoggedIn = false;
      state.token = null;
      state.expiresIn = null;
      state.name = null;
      localStorage.removeItem("token");
      localStorage.removeItem("expiresIn");
      localStorage.removeItem("name");
    },
  },
});

export default authSlice.reducer;
export const authActions = authSlice.actions;
