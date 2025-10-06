import { useParams } from "react-router-dom";
import { useAppDispatch } from "../hooks/CustomHook";
import type { User } from "../interfaces";
import { updateMember } from "../apis/project.api";
import { useState } from "react";
import { toast } from "react-toastify";
import ModalDelete from "./ModalDelete";

type Props = {
  handleToggleAllMembers: () => void;
  members: User[];
};

export default function ModalAllMemberOnProject({
  handleToggleAllMembers,
  members,
}: Props) {
  const dispatch = useAppDispatch();
  const { id: projectId } = useParams();

  const [updateRole, setUpdateRole] = useState<Record<string, string>>({});

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = event.target;
    setUpdateRole((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async () => {
    try {
      const entries = Object.entries(updateRole);
      if (entries.length === 0) {
        handleToggleAllMembers();
        return;
      }
      for (const [userId, newRole] of entries) {
        await dispatch(updateMember({ projectId, userId, newRole }));
      }
      toast.success("Cập nhật vai trò thành công!");
    } catch (error) {
      console.error("Lỗi khi cập nhật vai trò:", error);
    }
  };

  //Delete Modal
  const [toggleModal, setToggleModal] = useState<boolean>(false);
  const [deleteId, setDeleteId] = useState<string | undefined>(undefined);
  const handleToggleModal = () => {
    setToggleModal(toggleModal ? false : true);
  };

  return (
    <div>
      <div className="overlay" onClick={handleToggleAllMembers}></div>
      <div className="modal-container border border-secondary rounded p-2">
        <header className="d-flex justify-content-between border-bottom mb-3 p-2">
          <h4>Thành viên</h4>
          <button
            className="btn btn-close"
            onClick={handleToggleAllMembers}
          ></button>
        </header>

        <div className="border-bottom mb-3 p-2">
          <table className="table align-middle">
            <thead className="border-bottom">
              <tr>
                <th style={{ width: "60%" }}>Thành viên</th>
                <th style={{ width: "40%" }}>Vai trò</th>
              </tr>
            </thead>
            <tbody>
              {members.length !== 0 ? (
                members.map((member) => (
                  <tr key={member.id}>
                    <td className="d-flex align-items-center gap-3">
                      <img
                        src={member.image}
                        alt={member.fullname}
                        className="rounded-circle"
                        style={{
                          width: "40px",
                          height: "40px",
                          objectFit: "cover",
                        }}
                      />
                      <div>
                        <div className="fw-semibold">{member.fullname}</div>
                        <div
                          className="text-muted"
                          style={{ fontSize: "0.9rem" }}
                        >
                          {member.email}
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          id={member.id}
                          defaultValue={member.role}
                          onChange={handleChange}
                        />
                        <button
                          className="btn btn-link text-danger p-0"
                          onClick={() => {
                            handleToggleModal();
                            setDeleteId(member.id);
                          }}
                        >
                          <i
                            className="bi bi-trash"
                            style={{ fontSize: "1.2rem" }}
                          ></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={2}>Chưa có thành viên nào tham gia dự án!</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="d-flex justify-content-end gap-3 p-2">
          <button
            className="btn btn-secondary"
            onClick={handleToggleAllMembers}
          >
            Đóng
          </button>
          <button className="btn btn-primary" onClick={handleSubmit}>
            Lưu
          </button>
        </div>
      </div>
      {toggleModal && (
        <ModalDelete
          handleDeleteModal={handleToggleModal}
          deleteId={deleteId}
          name="member"
        />
      )}
    </div>
  );
}
