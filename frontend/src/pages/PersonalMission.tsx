import React, { useEffect, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "../hooks/CustomHook";
import { useParams } from "react-router-dom";
import { getAllTask } from "../apis/task.api";
import { getAllProjects } from "../apis/project.api";
import type { Task } from "../interfaces";
import { getAllUsers } from "../apis/auth.api";

export default function PersonalMission() {
  const { id } = useParams();

  const dispatch = useAppDispatch();

  const { data: taskData } = useAppSelector((state) => state.taskSlice);
  const { data: projectData } = useAppSelector((state) => state.projectSlice);

  const [userTasks, setUserTasks] = useState<Task[]>([]);
  const [toggleStates, setToggleStates] = useState<Record<string, boolean>>({});

  useEffect(() => {
    dispatch(getAllTask());
    dispatch(getAllProjects());
    dispatch(getAllUsers());
  }, []);

  // lọc task của user
  useEffect(() => {
    if (!taskData || !id) return;
    const tasks = taskData.filter((task) => task.assigneeId === id);
    setUserTasks(tasks);
  }, [taskData, id]);

  const [inputSearch, setInputSearch] = useState<string>("");
  const [sortOption, setSortOption] = useState<string>("dueDate");

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputSearch(e.target.value);
  };

  const handleSort = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOption(e.target.value);
  };

  // Group task theo project name
  const tasksByProject = useMemo(() => {
    if (!userTasks || !projectData) return {};

    //search
    const filteredTasks = userTasks.filter((task) =>
      task.taskName.toLowerCase().includes(inputSearch.toLowerCase())
    );
    //sort
    const sortedTasks = filteredTasks.sort((a, b) => {
      if (sortOption === "dueDate") {
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      }

      if (sortOption === "priority") {
        const priorityRank = { High: 1, Medium: 2, Low: 3, none: 0 };
        return priorityRank[a.priority] - priorityRank[b.priority];
      }

      return 0;
    });

    // group by name project
    const groupedTasks: Record<string, Task[]> = {};

    for (const task of sortedTasks) {
      const project = projectData.find((p) => p.id === task.projectId);
      const projectName = project?.projectName || "Dự án không xác định";

      if (!groupedTasks[projectName]) {
        groupedTasks[projectName] = [];
      }

      groupedTasks[projectName].push(task);
    }

    return groupedTasks;
  }, [userTasks, projectData, inputSearch, sortOption]);

  // Toggle mở đóng
  const handleToggle = (projectName: string) => {
    setToggleStates((prev) => ({
      ...prev,
      [projectName]: !prev[projectName],
    }));
  };

  return (
    <main className="d-flex flex-column gap-4">
      <h4>Quản lý nhiệm vụ</h4>

      {/* Bộ lọc sắp xếp và tìm kiếm */}
      <div className="d-flex gap-3 justify-content-end">
        <select
          className="form-select"
          name="sort"
          id="sort"
          style={{ width: "15%" }}
        >
          <option value="dueDate">Sắp xếp theo hạn chót</option>
          <option value="priority">Sắp xếp theo độ ưu tiên</option>
        </select>
        <input
          style={{ width: "20%" }}
          className="form-control"
          type="text"
          name="searchTask"
          id="searchTask"
          placeholder="Tìm kiếm nhiệm vụ"
          value={inputSearch}
          onChange={handleSearch}
        />
      </div>

      <div
        style={{ boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px" }}
        className="p-3 rounded"
      >
        <h4 className="mb-3">Danh sách nhiệm vụ theo dự án</h4>
        <table className="table">
          <thead className="table-light">
            <tr>
              <th>Tên Nhiệm Vụ</th>
              <th>Ưu Tiên</th>
              <th>Trạng thái</th>
              <th>Ngày Bắt Đầu</th>
              <th>Hạn Chót</th>
              <th>Tiến Độ</th>
            </tr>
          </thead>

          {Object.entries(tasksByProject).map(([projectName, tasks]) => (
            <tbody
              key={projectName}
              className={
                toggleStates[projectName] ? "tbody-expand" : "tbody-collapse"
              }
            >
              <tr
                style={{
                  cursor: "pointer",
                  backgroundColor: "#f6f6f6",
                  fontWeight: "bold",
                }}
                onClick={() => handleToggle(projectName)}
              >
                <td colSpan={7} style={{ padding: "12px" }}>
                  {toggleStates[projectName] ? "▼" : "▶"} {projectName}
                </td>
              </tr>

              {toggleStates[projectName] &&
                (tasks.length > 0 ? (
                  tasks.map((task) => (
                    <tr key={task.id}>
                      <td className="align-middle">{task.taskName}</td>
                      <td className="align-middle">
                        <span
                          className={`badge ${
                            task.priority === "Low"
                              ? "bg-info"
                              : task.priority === "Medium"
                                ? "bg-warning text-dark"
                                : "bg-danger"
                          }`}
                        >
                          {task.priority === "Low"
                            ? "Thấp"
                            : task.priority === "Medium"
                              ? "Trung bình"
                              : "Cao"}
                        </span>
                      </td>
                      <td className="align-middle">{task.status}</td>
                      <td className="text-primary align-middle">
                        {task.asignDate}
                      </td>
                      <td className="text-primary align-middle">
                        {task.dueDate}
                      </td>
                      <td className="align-middle">
                        <span
                          className={`badge ${
                            task.progress === "On schedule"
                              ? "bg-success"
                              : task.progress === "At risk"
                                ? "bg-warning text-dark"
                                : "bg-danger"
                          }`}
                        >
                          {task.progress === "On schedule"
                            ? "Đúng tiến độ"
                            : task.progress === "At risk"
                              ? "Có rủi ro"
                              : "Trễ hạn"}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="text-muted">
                      Không có nhiệm vụ nào.
                    </td>
                  </tr>
                ))}
            </tbody>
          ))}
        </table>
      </div>
    </main>
  );
}
