import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import type { Project, Task, User } from "../../interfaces";
import { useAppDispatch, useAppSelector } from "../../hooks/CustomHook";
import { getAllProjects } from "../../apis/project.api";
import ModalAddTask from "../../components/ModalAddTask";
import ModalAddMember from "../../components/ModalAddMember";
import { getAllTask } from "../../apis/task.api";
import { getAllUsers } from "../../apis/auth.api";
import TableDetails from "../../components/TableDetails";
import ModalAllMemberOnProject from "../../components/ModalAllMemberOnProject";
import { handleSearchTask, handleSortTask } from "../../redux/slices/taskSlice";

export default function ProjectDetails() {
  //Modal
  const [toggleModalAddTask, setToggleModalAddTask] = useState<boolean>(false);
  const handleToggleModalAddTask = () => {
    setToggleModalAddTask(!toggleModalAddTask);
    if (toggleModalAddTask) setEditId(undefined);
  };
  const [toggleModalAddMember, setToggleModalAddMember] =
    useState<boolean>(false);
  const handleToggleModalAddMember = () => {
    setToggleModalAddMember(!toggleModalAddMember);
  };
  const [toggleAllMembers, setToggleAllMembers] = useState<boolean>(false);
  const handleToggleAllMembers = () => setToggleAllMembers(!toggleAllMembers);

  //Data
  const { id } = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [members, setMembers] = useState<User[]>([]);
  const { data: projectData } = useAppSelector((state) => state.projectSlice);
  const { data: tasksData } = useAppSelector((state) => state.taskSlice);
  const { data: userData } = useAppSelector((state) => state.authSlice);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getAllProjects());
    dispatch(getAllTask());
    dispatch(getAllUsers());
  }, []);

  useEffect(() => {
    if (!projectData || !tasksData || !userData) return;

    const findProject = projectData.find((element) => element.id === id);
    if (findProject) {
      setProject(findProject);

      const newMembers: User[] = [];

      findProject.members.forEach((membersElement) => {
        const findUser = userData.find(
          (userElement) => userElement.id === membersElement.userId
        );
        if (findUser)
          newMembers.push({
            ...findUser,
            image: `https://ui-avatars.com/api/?name=${encodeURIComponent(findUser.fullname)}&background=random`,
            role: membersElement.role,
          });
      });
      setMembers(newMembers);
    }
  }, [projectData, id, tasksData, userData]);

  //Gộp dữ liệu với status khác nhau
  const tasksByStatus = useMemo(() => {
    if (!tasksData || !id)
      return {
        "To do": [],
        "In Progress": [],
        Pending: [],
        Done: [],
      };

    const filter = (status: Task["status"]) =>
      tasksData.filter(
        (task) => task.status === status && task.projectId === id
      );

    return {
      "To do": filter("To do"),
      "In Progress": filter("In Progress"),
      Pending: filter("Pending"),
      Done: filter("Done"),
    };
  }, [tasksData, id]);

  //edit
  const [editId, setEditId] = useState<string | undefined>(undefined);
  const handleSetEditId = (id: string) => {
    setEditId(id);
    setToggleModalAddTask(true);
  };

  //search & sort
  const [inputSearch, setInputSearch] = useState<string>("");
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setInputSearch(value);
    dispatch(handleSearchTask(value));
  };

  const handleSort = (event: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(handleSortTask(event.target.value));
  };

  return (
    <main className="d-flex flex-column gap-3">
      <header style={{ gap: "15%" }} className="d-flex justify-content-between">
        <section style={{ width: "60%" }} className="d-flex flex-column gap-3">
          <h4>{project?.projectName}</h4>
          <div className="d-flex gap-2">
            <img
              style={{ width: "200px" }}
              src={String(project?.image)}
              alt={project?.projectName}
            />
            <p>{project?.description}</p>
          </div>
        </section>
        <section style={{ width: "40%" }}>
          <div className="d-flex flex-column gap-3">
            <div className="d-flex justify-content-between">
              <h4>Thành viên</h4>
              <button
                className="btn btn-outline-secondary"
                onClick={handleToggleModalAddMember}
              >
                + Thêm thành viên
              </button>
            </div>
            <div className="d-flex gap-4 justify-content-between align-items-start">
              {/* chỉ render ra bên ngoài 2 member */}
              {members.slice(0, 2).map((member) => (
                <div
                  key={member.id}
                  className="d-flex flex-row align-items-center text-center gap-2"
                  style={{ width: "fit-content" }}
                >
                  <img
                    src={
                      member.image ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(member.fullname)}&background=random&color=fff`
                    }
                    alt="avatar"
                    className="rounded-circle"
                    style={{
                      width: "48px",
                      height: "48px",
                      objectFit: "cover",
                    }}
                  />
                  <div className="d-flex flex-column text-start">
                    <div
                      style={{
                        fontWeight: 600,
                        fontSize: "13px",
                        marginTop: "4px",
                      }}
                    >
                      {member.fullname}
                    </div>
                    <div style={{ fontSize: "12px", color: "gray" }}>
                      {member.role}
                    </div>
                  </div>
                </div>
              ))}

              {/* Nút ba chấm */}
              <div
                className="rounded-circle d-flex justify-content-center align-items-center"
                style={{
                  width: "48px",
                  height: "48px",
                  backgroundColor: "#e0e0e0",
                  fontSize: "20px",
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
                onClick={handleToggleAllMembers}
              >
                ...
              </div>
            </div>
          </div>
          <div className="d-flex gap-2"></div>
        </section>
      </header>

      <div className="d-flex justify-content-between">
        <button
          className="btn btn-primary w-45"
          onClick={handleToggleModalAddTask}
        >
          + Thêm nhiệm vụ
        </button>
        {/* Sắp xếp và tìm kiếm theo tên */}
        <div className="d-flex gap-3">
          <select
            className="form-select"
            name="sort"
            id="sort"
            style={{ width: "40%" }}
            onChange={handleSort}
          >
            <option value="dueDate">Sắp xếp theo hạn chót</option>
            <option value="priority">Sắp xếp theo độ ưu tiên</option>
          </select>
          <input
            style={{ width: "60%" }}
            className="form-control"
            type="text"
            name="searchTask"
            id="searchTask"
            placeholder="Tìm kiếm nhiệm vụ"
            value={inputSearch}
            onChange={handleSearch}
          />
        </div>
      </div>
      <div
        style={{ boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px" }}
        className="p-3 rounded"
      >
        <h4>Danh sách nhiệm vụ</h4>
        <TableDetails
          tasksByStatus={tasksByStatus}
          userData={userData || []}
          handleSetEditId={handleSetEditId}
        />
      </div>

      {/* Modal Thêm nhiệm vụ */}
      {toggleModalAddTask && (
        <ModalAddTask
          handleToggleModalAddTask={handleToggleModalAddTask}
          projectId={id}
          editId={editId}
        />
      )}

      {/* Modal Thêm thành viên */}
      {toggleModalAddMember && (
        <ModalAddMember
          handleToggleModalAddMember={handleToggleModalAddMember}
          projectId={id}
        />
      )}
      {/* Modal xem đầy đủ thành viên có trong project */}
      {toggleAllMembers && (
        <ModalAllMemberOnProject
          handleToggleAllMembers={handleToggleAllMembers}
          members={members}
        />
      )}
    </main>
  );
}
