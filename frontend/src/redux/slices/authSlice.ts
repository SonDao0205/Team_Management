import { createSlice } from "@reduxjs/toolkit";
import type { AuthType } from "../../interfaces";
import { addUser, getAllUsers } from "../../apis/auth.api";

const initialState: AuthType = {
  status: "idle",
  data: [],
  allData: [],
  error: undefined,
};

const authSlice = createSlice({
  name: "authSlice",
  initialState,
  reducers: {},
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

export default authSlice.reducer;
