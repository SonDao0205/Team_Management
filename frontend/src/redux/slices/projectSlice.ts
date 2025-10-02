import { createSlice } from "@reduxjs/toolkit";
import type { ProjectType } from "../../interfaces";
import {
  addProject,
  deleteProject,
  getAllProjects,
  updateProject,
} from "../../apis/project.api";

const initialState: ProjectType = {
  status: "idle",
  data: [],
  allData: [],
  error: undefined,
};

const projectSlice = createSlice({
  name: "projectSlice",
  initialState,
  reducers: {
    handleSearchProject: (state, action) => {
      if (action.payload.trim()) {
        state.data = state.allData.filter((element) =>
          element.projectName
            .toLowerCase()
            .includes(action.payload.trim().toLowerCase())
        );
      } else {
        state.data = state.allData;
      }
    },
  },
  extraReducers(builder) {
    builder
      .addCase(getAllProjects.pending, (state) => {
        state.status = "pending";
      })
      .addCase(getAllProjects.fulfilled, (state, action) => {
        (state.data = action.payload), (state.allData = action.payload);
      })
      .addCase(addProject.fulfilled, (state, action) => {
        state.data.push(action.payload);
        state.allData.push(action.payload);
      })
      .addCase(deleteProject.fulfilled, (state, action) => {
        const { id } = action.payload;
        if (!id) return;
        state.data = state.data.filter((element) => element.id !== id);
        state.allData = state.allData.filter((element) => element.id !== id);
      })
      .addCase(updateProject.fulfilled, (state, action) => {
        const { id } = action.payload;
        const index = state.allData.findIndex((element) => element.id === id);
        if (index === -1) return;
        state.data[index] = action.payload;
        state.allData[index] = action.payload;
      });
  },
});

export const { handleSearchProject } = projectSlice.actions;
export default projectSlice.reducer;
