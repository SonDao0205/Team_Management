import { createSlice } from "@reduxjs/toolkit";
import type { AuthType } from "../../interfaces";
import { addUser, getAllUsers } from "../../apis/auth.api";

const initialState: AuthType = {
  status: "idle",
  data: [],
  allData: [],
  error: undefined,
  currentUser: null,
};

const authSlice = createSlice({
  name: "authSlice",
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.currentUser = action.payload;
    },
    logOut: (state) => {
      state.currentUser = null;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(getAllUsers.pending, (state) => {
        state.status = "pending";
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.status = "success";
        state.data = action.payload;
        state.allData = action.payload;
      })
      .addCase(addUser.fulfilled, (state, action) => {
        state.allData.push(action.payload);
        state.data.push(action.payload);
      });
  },
});
export const { loginSuccess, logOut } = authSlice.actions;
export default authSlice.reducer;
