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
  //Modal add
  const [toggleModal, setToggleModal] = useState<boolean>(false);
  const handleToggleModal = () => {
    setToggleModal(toggleModal ? false : true);
  };
  //Modal delete
  const [deleteModal, setDeleteModal] = useState<boolean>(false);
  const handleDeleteModal = () => {
    setDeleteModal(deleteModal ? false : true);
  };
  const [deleteId, setDeleteId] = useState<string | undefined>(undefined);

  //Data
  const { data } = useAppSelector((state) => state.projectSlice);
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(getAllProjects());
  }, []);

  //Search
  const [searchInput, setSearchInput] = useState<string>("");

  //add & edit
  const [editId, setEditId] = useState<string | undefined>(undefined);
  const handleEditProject = (id: string) => {
    setEditId(id);
    setToggleModal(true);
  };

  const handleAddProject = (newProject: Omit<Project, "id">) => {
    if (editId) {
      dispatch(updateProject({ ...newProject, id: editId }));
    } else {
      dispatch(addProject(newProject));
    }

    setToggleModal(false);
  };

  return (
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
            {data.map((element) => {
              return (
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
              );
            })}
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
        />
      )}
    </div>
  );
}
