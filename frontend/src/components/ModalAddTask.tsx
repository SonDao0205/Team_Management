import React, { useEffect, useState, type ChangeEvent } from "react";
import { initTask, type Task, type User } from "../interfaces";
import { useAppDispatch, useAppSelector } from "../hooks/CustomHook";
import { getAllProjects } from "../apis/project.api";
import { getAllUsers } from "../apis/auth.api";
import { addTask, getAllTask, updateTask } from "../apis/task.api";

type Props = {
  handleToggleModalAddTask: () => void;
  projectId: string | undefined;
  editId: string | undefined;
};

type Error = {
  taskNameError: string | undefined;
  assigneeIdError: string | undefined | "none";
  asignDateError: string | undefined;
  dueDateError: string | undefined;
  priorityError: "none" | string;
  progressError: "none" | string;
  statusError: "none" | string;
};

const initError: Error = {
  taskNameError: undefined,
  assigneeIdError: "none",
  asignDateError: undefined,
  dueDateError: undefined,
  priorityError: "none",
  progressError: "none",
  statusError: "none",
};

export default function ModalAddTask({
  handleToggleModalAddTask,
  projectId,
  editId,
}: Props) {
  //data
  const { data } = useAppSelector((state) => state.projectSlice);
  const { data: userData } = useAppSelector((state) => state.authSlice);
  const { data: tasksData } = useAppSelector((state) => state.taskSlice);
  const [userSelect, setUserSelect] = useState<User[]>([]);
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(getAllProjects());
    dispatch(getAllUsers());
    dispatch(getAllTask());
  }, [dispatch]);

  useEffect(() => {
    if (!data?.length || !userData?.length || !projectId) return;

    const findProject = data.find((element) => element.id === projectId);
    if (!findProject) return;

    const memberUserIds = new Set(findProject.members.map((m) => m.userId));
    const selectedUsers = userData.filter((user) => memberUserIds.has(user.id));
    setUserSelect(selectedUsers);
  }, [data, userData, projectId]);

  useEffect(() => {
    if (!editId) return;
    const findTask = tasksData.find((task) => task.id === editId);
    if (findTask) setNewTask(findTask);
  }, [editId, tasksData]);

  //Form
  const [newTask, setNewTask] = useState<Omit<Task, "id">>(initTask);
  const [error, setError] = useState<Error>(initError);

  const validate = (): boolean => {
    const newError: Error = { ...initError };
    let isValid = true;

    if (newTask.taskName.trim().length === 0) {
      newError.taskNameError = "Bạn cần nhập tên nhiệm vụ!";
      isValid = false;
    } else {
      const exist = tasksData.find(
        (element) =>
          element.taskName.trim().toLowerCase() ===
          newTask.taskName.trim().toLowerCase()
      );
      if (exist) {
        newError.taskNameError = "Nhiệm vụ đã tồn tại!";
        isValid = false;
      }
    }

    if (newTask.status === "none") {
      newError.statusError = "Bạn cần chọn trạng thái!";
      isValid = false;
    }

    if (newTask.progress === "none") {
      newError.progressError = "Bạn cần chọn tiến độ!";
      isValid = false;
    }

    if (newTask.priority === "none") {
      newError.priorityError = "Bạn cần chọn độ ưu tiên!";
      isValid = false;
    }

    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().split("T")[0];

    if (newTask.asignDate.trim().length === 0) {
      newError.asignDateError = "Bạn cần chọn ngày bắt đầu!";
      isValid = false;
    } else if (newTask.asignDate > formattedDate) {
      newError.asignDateError = "Ngày bắt đầu phải nhỏ hơn ngày hiện tại!";
      isValid = false;
    } else if (newTask.asignDate > newTask.dueDate) {
      newError.asignDateError = "Ngày bắt đầu phải nhỏ hơn ngày kết thúc!";
      isValid = false;
    }

    if (newTask.dueDate.trim().length === 0) {
      newError.dueDateError = "Bạn cần chọn ngày hạn chót!";
      isValid = false;
    }

    setError(newError);
    return isValid;
  };

  const handleInput = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setNewTask({
      ...newTask,
      [name]: value,
    });
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (editId !== undefined) {
      dispatch(updateTask({ ...newTask, id: editId }));
      setNewTask(initTask);
      handleToggleModalAddTask();
      return;
    }
    if (!validate()) return;
    dispatch(addTask({ ...newTask, projectId: String(projectId) }));
    setNewTask(initTask);
    handleToggleModalAddTask();
  };

  return (
    <div>
      <div className="overlay" onClick={handleToggleModalAddTask}></div>
      <div className="modal-container border border-secondary rounded p-2">
        <header className="d-flex justify-content-between border-bottom mb-3 p-2">
          <h4>Thêm/Sửa nhiệm vụ</h4>
          <button
            className="btn btn-close"
            onClick={handleToggleModalAddTask}
          ></button>
        </header>
        <form onSubmit={handleSubmit}>
          <div className="d-flex flex-column gap-4 p-3 border-bottom mb-3">
            <div>
              <label htmlFor="taskName">Tên nhiệm vụ</label>
              <input
                type="text"
                className={
                  error.taskNameError
                    ? "form-control border-danger"
                    : "form-control"
                }
                name="taskName"
                id="taskName"
                placeholder="Nhập tên nhiệm vụ"
                value={newTask.taskName}
                onChange={handleInput}
              />
              {error.taskNameError && (
                <p className="text-danger">{error.taskNameError}</p>
              )}
            </div>
            <div>
              <label htmlFor="assigneeId">Người phụ trách</label>
              <select
                className="form-select"
                name="assigneeId"
                id="assigneeId"
                value={newTask.assigneeId}
                onChange={(event: React.ChangeEvent<HTMLSelectElement>) =>
                  setNewTask({ ...newTask, assigneeId: event.target.value })
                }
              >
                <option value="none">Chọn người phụ trách</option>
                {userSelect.map((element) => (
                  <option key={element.id} value={element.id}>
                    {element.fullname}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="status">Trạng thái</label>
              <select
                className={
                  error.statusError !== "none"
                    ? "form-select border-danger"
                    : "form-select"
                }
                name="status"
                id="status"
                value={newTask.status}
                onChange={(event: React.ChangeEvent<HTMLSelectElement>) =>
                  setNewTask({
                    ...newTask,
                    status: event.target.value as Task["status"],
                  })
                }
              >
                <option value="none">Chọn trạng thái nhiệm vụ</option>
                <option value="To do">To do</option>
                <option value="In Progress">In Progress</option>
                <option value="Pending">Pending</option>
                <option value="Done">Done</option>
              </select>
              {error.statusError !== "none" && (
                <p className="text-danger">{error.statusError}</p>
              )}
            </div>
            <div>
              <label htmlFor="asignDate">Ngày bắt đầu</label>
              <input
                className={
                  error.asignDateError
                    ? "form-control border-danger"
                    : "form-control"
                }
                type="date"
                name="asignDate"
                id="asignDate"
                value={newTask.asignDate}
                onChange={handleInput}
              />
              {error.asignDateError && (
                <p className="text-danger">{error.asignDateError}</p>
              )}
            </div>
            <div>
              <label htmlFor="dueDate">Hạn chót</label>
              <input
                className={
                  error.dueDateError
                    ? "form-control border-danger"
                    : "form-control"
                }
                type="date"
                name="dueDate"
                id="dueDate"
                value={newTask.dueDate}
                onChange={handleInput}
              />
              {error.dueDateError && (
                <p className="text-danger">{error.dueDateError}</p>
              )}
            </div>
            <div>
              <label htmlFor="priority">Độ ưu tiên</label>
              <select
                className={
                  error.priorityError !== "none"
                    ? "form-select border-danger"
                    : "form-select"
                }
                name="priority"
                id="priority"
                value={newTask.priority}
                onChange={(event: React.ChangeEvent<HTMLSelectElement>) =>
                  setNewTask({
                    ...newTask,
                    priority: event.target.value as Task["priority"],
                  })
                }
              >
                <option value="none">Chọn độ ưu tiên</option>
                <option value="Low">Thấp</option>
                <option value="Medium">Trung bình</option>
                <option value="High">Cao</option>
              </select>
              {error.priorityError !== "none" && (
                <p className="text-danger">{error.priorityError}</p>
              )}
            </div>
            <div>
              <label htmlFor="progress">Tiến độ</label>
              <select
                className={
                  error.progressError !== "none"
                    ? "form-select border-danger"
                    : "form-select"
                }
                name="progress"
                id="progress"
                value={newTask.progress}
                onChange={(event: React.ChangeEvent<HTMLSelectElement>) =>
                  setNewTask({
                    ...newTask,
                    progress: event.target.value as Task["progress"],
                  })
                }
              >
                <option value="none">Chọn tiến độ</option>
                <option value="On schedule">Đúng tiến độ</option>
                <option value="At risk">Có rủi ro</option>
                <option value="Delayed">Trễ hạn</option>
              </select>
              {error.progressError !== "none" && (
                <p className="text-danger">{error.progressError}</p>
              )}
            </div>
          </div>
          <div className="d-flex justify-content-end gap-3 p-2">
            <button
              className="btn btn-secondary"
              onClick={handleToggleModalAddTask}
            >
              Huỷ
            </button>
            <button type="submit" className="btn btn-primary">
              Lưu
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
