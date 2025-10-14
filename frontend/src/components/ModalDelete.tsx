import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { deleteMember, deleteProject } from "../apis/project.api";
import { useAppDispatch } from "../hooks/CustomHook";
import { deleteTask, getAllTask } from "../apis/task.api";

type Props = {
  handleDeleteModal: () => void;
  deleteId: string | undefined;
  name: "project" | "task" | "member";
};

export default function ModalDelete({
  handleDeleteModal,
  deleteId,
  name,
}: Props) {
  const dispatch = useAppDispatch();
  const { id: projectId } = useParams();

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      if (name === "project") {
        await dispatch(deleteProject(deleteId));
        toast.success("Xoá dự án thành công!");
      } else if (name === "task") {
        await dispatch(deleteTask(deleteId));
        toast.success("Xoá nhiệm vụ thành công!");
      } else if (name === "member") {
        await dispatch(deleteMember({ projectId, userId: deleteId }));
        dispatch(getAllTask());
        toast.success("Xoá thành viên thành công!");
      }

      handleDeleteModal();
    } catch (error) {
      toast.error("Lỗi khi xoá!");
      console.error(error);
    }
  };

  return (
    <div>
      <div className="overlay" style={{ zIndex: "1001" }}></div>
      <div
        className="modal-container border border-secondary rounded p-2"
        style={{ top: "20%" }}
      >
        <header className="d-flex justify-content-between border-bottom mb-3 p-2">
          <h4>Xác nhận xoá</h4>
          <button
            className="btn btn-close"
            onClick={handleDeleteModal}
          ></button>
        </header>
        <div className="border-bottom mb-3 p-2">
          {name === "project" ? (
            <p>Bạn chắc chắn muốn xoá dự án này?</p>
          ) : name === "task" ? (
            <p>Bạn chắc chắn muốn xoá nhiệm vụ này?</p>
          ) : (
            <p>Bạn chắc chắn muốn xoá thành viên này?</p>
          )}
        </div>
        <div className="d-flex justify-content-end gap-3 p-2">
          <button className="btn btn-secondary" onClick={handleDeleteModal}>
            Huỷ
          </button>
          <button className="btn btn-danger" onClick={handleDelete}>
            Xoá
          </button>
        </div>
      </div>
    </div>
  );
}
