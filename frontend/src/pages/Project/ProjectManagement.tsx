import { useEffect, useState } from "react";
import ModalAddProject from "../../components/ModalAddProject";
import { useAppDispatch, useAppSelector } from "../../hooks/CustomHook";
import {
  addProject,
  getAllProjects,
  updateProject,
} from "../../apis/project.api";
import type { Project } from "../../interfaces";
import { handleSearchProject } from "../../redux/slices/projectSlice";
import ModalDelete from "../../components/ModalDelete";
import { useNavigate } from "react-router-dom";

export default function ProjectManagement() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { data } = useAppSelector((state) => state.projectSlice);
  const [currentUser, setCurrentUser] = useState<string | undefined>(undefined);
  const [projectData, setProjectData] = useState<Project[]>([]);

  // modal
  const [toggleModal, setToggleModal] = useState(false);
  const handleToggleModal = () => {
    setToggleModal(!toggleModal);
    if (!toggleModal) setEditId(undefined);
  };

  const [deleteModal, setDeleteModal] = useState(false);
  const handleDeleteModal = () => setDeleteModal(!deleteModal);
  const [deleteId, setDeleteId] = useState<string | undefined>(undefined);
  // data
  useEffect(() => {
    dispatch(getAllProjects());
    const user = JSON.parse(localStorage.getItem("user") || "[]");
    if (user) setCurrentUser(user);
  }, [dispatch]);

  useEffect(() => {
    if (!data || !currentUser) return;
    setProjectData(
      data.filter((project) =>
        project.members?.some(
          (member) =>
            member.userId === currentUser && member.role === "project owner"
        )
      )
    );
  }, [data, currentUser]);

  // search
  const [searchInput, setSearchInput] = useState("");

  // add/edit
  const [editId, setEditId] = useState<string | undefined>(undefined);
  const handleEditProject = (id: string) => {
    setEditId(id);
    setToggleModal(true);
  };

  const handleAddProject = (newProject: Omit<Project, "id">) => {
    if (!currentUser) return;

    if (!editId) {
      const projectWithOwner: Omit<Project, "id"> = {
        ...newProject,
        members: [
          {
            userId: currentUser,
            role: "project owner",
          },
        ],
      };

      dispatch(addProject(projectWithOwner));
    } else {
      dispatch(updateProject({ ...newProject, id: editId }));
    }

    setToggleModal(false);
  };

  // pagination
  const itemsPerPage = 5;
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(projectData.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = projectData.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  return (
    <>
      <div className="border border-secondary rounded p-4 d-flex flex-column gap-3">
        <h2>Quản Lý Dự Án Nhóm</h2>

        <div className="d-flex justify-content-between">
          <button className="btn btn-primary" onClick={handleToggleModal}>
            + Thêm dự án
          </button>
          <input
            className="form-control"
            type="text"
            placeholder="Tìm kiếm dự án"
            style={{ width: "40%" }}
            value={searchInput}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              const value = event.target.value;
              setSearchInput(value);
              dispatch(handleSearchProject(value));
              setCurrentPage(1);
            }}
          />
        </div>

        <div>
          <h4>Danh sách dự án</h4>
          <table className="table">
            <thead>
              <tr className="table-dark">
                <td className="text-center">ID</td>
                <td>Tên Dự Án</td>
                <td style={{ width: "25%" }} className="text-center">
                  Hành Động
                </td>
              </tr>
            </thead>
            <tbody>
              {currentData.length > 0 ? (
                currentData.map((element) => (
                  <tr key={element.id}>
                    <td className="text-center align-middle">{element.id}</td>
                    <td className="align-middle">{element.projectName}</td>
                    <td className="d-flex gap-2 justify-content-evenly">
                      <button
                        className="btn btn-warning"
                        onClick={() => handleEditProject(element.id)}
                      >
                        Sửa
                      </button>
                      <button
                        className="btn btn-danger"
                        onClick={() => {
                          setDeleteId(element.id);
                          handleDeleteModal();
                        }}
                      >
                        Xoá
                      </button>
                      <button
                        className="btn btn-primary"
                        onClick={() =>
                          navigate(`/team-management/projects/${element.id}`)
                        }
                      >
                        Chi tiết
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="text-center text-muted">
                    Không có dự án nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {toggleModal && (
          <ModalAddProject
            handleToggleModal={handleToggleModal}
            handleAddProject={handleAddProject}
            data={data}
            editId={editId}
          />
        )}
        {deleteModal && (
          <ModalDelete
            handleDeleteModal={handleDeleteModal}
            deleteId={deleteId}
            name="project"
          />
        )}
      </div>
      <div className="d-flex justify-content-center align-items-center gap-2 mt-3">
        <button
          className="btn btn-outline-secondary btn-sm"
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
        >
          Trước
        </button>

        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index}
            className={`btn btn-sm ${
              currentPage === index + 1 ? "btn-primary" : "btn-outline-primary"
            }`}
            onClick={() => handlePageChange(index + 1)}
          >
            {index + 1}
          </button>
        ))}

        <button
          className="btn btn-outline-secondary btn-sm"
          disabled={currentPage === totalPages}
          onClick={() => handlePageChange(currentPage + 1)}
        >
          Sau
        </button>
      </div>
    </>
  );
}
