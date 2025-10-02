import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { API_PROJECT } from "../constants/constant";
import type { Project } from "../interfaces";

export const getAllProjects = createAsyncThunk(
  "projects/getAllProjects",
  async () => {
    try {
      const res = await axios.get(API_PROJECT);
      return res.data;
    } catch (error) {
      console.log(`Get Projects Error :`, error);
    }
  }
);

export const addProject = createAsyncThunk(
  "projects/addProject",
  async (newProject: Omit<Project, "id">) => {
    try {
      const res = await axios.post(API_PROJECT, newProject);
      return res.data;
    } catch (error) {
      console.log(`Add Projects Error :`, error);
    }
  }
);

export const deleteProject = createAsyncThunk<{ id: string }, string>(
  "projects/deleteProject",
  async (id: string) => {
    try {
      await axios.delete(`${API_PROJECT}/${id}`);
      return { id };
    } catch (error) {
      console.log(`Delete Projects Error :`, error);
      throw error;
    }
  }
);

export const updateProject = createAsyncThunk(
  "projects/updateProject",
  async (project: Project) => {
    try {
      const { id } = project;
      const res = await axios.put(`${API_PROJECT}/${id}`, project);
      return res.data;
    } catch (error) {
      console.log(`Update Project Error : `, error);
    }
  }
);
