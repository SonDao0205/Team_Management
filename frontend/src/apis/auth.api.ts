import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import type { User } from "../interfaces";
import { API_USER } from "../constants/constant";

export const getAllUsers = createAsyncThunk("auth/getAllUsers", async () => {
  try {
    const res = await axios.get(API_USER);
    return res.data;
  } catch (error) {
    console.log(`Get user error : `, error);
  }
});

export const addUser = createAsyncThunk(
  "auth/addUser",
  async (newUser: Omit<User, "id">) => {
    try {
      const response = await axios.post(API_USER, newUser);
      return response.data;
    } catch (error) {
      console.log(`Add User Error : `, error);
    }
  }
);
