import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { API_PROJECT, API_TASK } from "../constants/constant";
import type { Members, Project, Task } from "../interfaces";

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
      const tasks = await axios.get<Task[]>(API_TASK);
      const filtered = tasks.data.filter((element) => element.projectId === id);
      await Promise.all(
        filtered.map((element) => axios.delete(`${API_TASK}/${element.id}`))
      );
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

export const addMember = createAsyncThunk(
  "projects/addMember",
  async ({
    member,
    projectId,
  }: {
    member: Members;
    projectId: string | undefined;
  }) => {
    if (projectId === undefined) return;
    try {
      const project = await axios.get<Project>(`${API_PROJECT}/${projectId}`);
      const currentProject = project.data;

      const updatedProject: Project = {
        ...currentProject,
        members: [...currentProject.members, member],
      };

      const update = await axios.put(
        `${API_PROJECT}/${projectId}`,
        updatedProject
      );

      return update.data;
    } catch (error) {
      console.log(`Add member Error : `, error);
    }
  }
);

export const updateMember = createAsyncThunk(
  "projects/updateMember",
  async ({
    projectId,
    userId,
    newRole,
  }: {
    projectId: string | undefined;
    userId: string;
    newRole: string;
  }) => {
    if (!projectId) return;
    try {
      const res = await axios.get<Project>(`${API_PROJECT}/${projectId}`);
      const currentProject = res.data;

      const updatedMembers = currentProject.members.map((element) =>
        element.userId === userId ? { ...element, role: newRole } : element
      );

      const updatedProject: Project = {
        ...currentProject,
        members: updatedMembers,
      };

      const update = await axios.put(
        `${API_PROJECT}/${projectId}`,
        updatedProject
      );

      return update.data;
    } catch (error) {
      console.log("Update Member Error:", error);
      throw error;
    }
  }
);

export const deleteMember = createAsyncThunk(
  "projects/deleteMember",
  async ({
    projectId,
    userId,
  }: {
    projectId: string | undefined;
    userId: string;
  }) => {
    if (!projectId) return;
    try {
      const res = await axios.get<Project>(`${API_PROJECT}/${projectId}`);
      const currentProject = res.data;

      const updatedMembers = currentProject.members.filter(
        (element) => element.userId !== userId
      );

      const updatedProject = { ...currentProject, members: updatedMembers };
      await axios.put(`${API_PROJECT}/${projectId}`, updatedProject);

      const task = await axios.get<Task[]>(API_TASK);
      const userTasks = task.data.filter(
        (task) => task.assigneeId === userId && task.projectId === projectId
      );

      for (const task of userTasks) {
        await axios.put(`${API_TASK}/${task.id}`, {
          ...task,
          assigneeId: "none",
        });
      }

      return { projectId, userId };
    } catch (error) {
      console.error("Remove member error:", error);
      throw error;
    }
  }
);
