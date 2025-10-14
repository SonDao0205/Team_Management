import { createSlice } from "@reduxjs/toolkit";
import type { ProjectType } from "../../interfaces";
import {
  addMember,
  addProject,
  deleteMember,
  deleteProject,
  getAllProjects,
  updateMember,
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
      const value = action.payload.trim().toLowerCase();
      if (!value) {
        state.data = state.allData;
        return;
      }
      state.data = state.allData.filter((element) =>
        element.projectName.toLowerCase().includes(value)
      );
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
      })
      .addCase(addMember.fulfilled, (state, action) => {
        const { id } = action.payload;
        const index = state.allData.findIndex((element) => element.id === id);
        if (index === -1) return;
        state.data[index] = action.payload;
        state.allData[index] = action.payload;
      })
      .addCase(updateMember.fulfilled, (state, action) => {
        const updatedProject = action.payload;
        if (!updatedProject) return;

        const index = state.data.findIndex(
          (element) => element.id === updatedProject.id
        );
        if (index !== -1) {
          state.data[index] = updatedProject;
          state.allData[index] = updatedProject;
        }
      })
      .addCase(deleteMember.fulfilled, (state, action) => {
        if (!action.payload) return;
        const { projectId, userId } = action.payload;
        const project = state.data.find((element) => element.id === projectId);
        if (!project) return;

        project.members = project.members.filter(
          (element) => element.userId !== userId
        );
      });
  },
});

export const { handleSearchProject } = projectSlice.actions;
export default projectSlice.reducer;
