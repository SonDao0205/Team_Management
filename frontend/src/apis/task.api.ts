import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { API_TASK } from "../constants/constant";
import type { Task } from "../interfaces";

export const getAllTask = createAsyncThunk("tasks/getAllTasks", async () => {
  try {
    const res = await axios.get(API_TASK);
    return res.data;
  } catch (error) {
    console.log(`Get All Task Error : `, error);
  }
});

export const addTask = createAsyncThunk(
  "tasks/addTask",
  async (newTask: Omit<Task, "id">) => {
    try {
      const res = await axios.post(API_TASK, newTask);
      return res.data;
    } catch (error) {
      console.log(`Add Task Error : `, error);
    }
  }
);

export const deleteTask = createAsyncThunk<string, string>(
  "tasks/deleteTask",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_TASK}/${id}`);
      return id;
    } catch (err: any) {
      return rejectWithValue(err?.response?.data?.message ?? "Delete failed");
    }
  }
);

export const updateTask = createAsyncThunk(
  "tasks/updateTask",
  async (task: Task) => {
    try {
      const { id } = task;
      const res = await axios.put(`${API_TASK}/${id}`, task);
      return res.data;
    } catch (error) {
      console.log(`Update Project Error : `, error);
    }
  }
);
