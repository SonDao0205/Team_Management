import { createSlice } from "@reduxjs/toolkit";
import type { Task, TaskType } from "../../interfaces";
import {
  addTask,
  deleteTask,
  getAllTask,
  updateStatus,
  updateTask,
} from "../../apis/task.api";

const initialState: TaskType = {
  status: "idle",
  data: [],
  allData: [],
  error: undefined,
};

const taskSlice = createSlice({
  name: "taskSlice",
  initialState,
  reducers: {
    handleSearchTask: (state, action) => {
      const value = action.payload.trim().toLowerCase();
      if (!value) {
        state.data = [...state.allData];
        return;
      }
      state.data = state.allData.filter((element) =>
        element.taskName.trim().toLowerCase().includes(value)
      );
    },
    handleSortTask: (state, action) => {
      const value = action.payload as "priority" | "dueDate";
      state.data = [...state.allData];

      switch (value) {
        case "priority": {
          const priorityOrder: Record<Task["priority"], number> = {
            High: 3,
            Medium: 2,
            Low: 1,
            none: 0,
          };

          state.data.sort(
            (a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]
          );
          break;
        }

        case "dueDate": {
          state.data.sort((a, b) => {
            const dateA = new Date(a.dueDate).getTime();
            const dateB = new Date(b.dueDate).getTime();

            if (isNaN(dateA)) return 1;
            if (isNaN(dateB)) return -1;

            return dateA - dateB;
          });
          break;
        }

        default:
          state.data = state.allData;
          break;
      }
    },
  },
  extraReducers(builder) {
    builder
      .addCase(getAllTask.pending, (state) => {
        state.status = "pending";
      })
      .addCase(getAllTask.fulfilled, (state, action) => {
        (state.status = "success"), (state.data = action.payload);
        state.allData = action.payload;
      })
      .addCase(addTask.fulfilled, (state, action) => {
        state.data.push(action.payload);
        state.allData.push(action.payload);
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        const id = action.payload;
        state.data = state.data.filter((element) => element.id !== id);
        state.allData = state.allData.filter((element) => element.id !== id);
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        const { id } = action.payload;
        const index = state.data.findIndex((element) => element.id === id);
        if (index !== -1) {
          state.data[index] = action.payload;
          state.allData[index] = action.payload;
        }
      })
      .addCase(updateStatus.fulfilled, (state, action) => {
        const { id, status } = action.payload;
        if (!id) return;
        const index = state.data.findIndex((element) => element.id === id);
        if (index !== -1) {
          state.data[index].status = status;
          state.allData[index] = status;
        }
      });
  },
});

export const { handleSearchTask, handleSortTask } = taskSlice.actions;
export default taskSlice.reducer;
