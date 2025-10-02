import { toast } from "react-toastify";
import { deleteProject } from "../apis/project.api";
import { useAppDispatch } from "../hooks/CustomHook";

type Props = {
  handleDeleteModal: () => void;
  deleteId: string | undefined;
};

export default function ModalDelete({ handleDeleteModal, deleteId }: Props) {
  const dispatch = useAppDispatch();
  const handleDeleteProject = (id: string) => {
    dispatch(deleteProject(id));
  };

  return (
    <div>
      <div className="overlay"></div>
      <div className="modal-container border border-secondary rounded p-2">
        <header className="d-flex justify-content-between border-bottom mb-3 p-2">
          <h4>Xác nhận xoá</h4>
          <button
            className="btn btn-close"
            onClick={handleDeleteModal}
          ></button>
        </header>
        <div className="border-bottom mb-3 p-2">
          <p>Bạn chắc chắn muốn xoá dự án này ?</p>
        </div>
        <div className="d-flex justify-content-end gap-3 p-2">
          <button className="btn btn-secondary" onClick={handleDeleteModal}>
            Huỷ
          </button>
          <button
            className="btn btn-danger"
            onClick={() => {
              if (!deleteId) return;
              handleDeleteProject(deleteId);
              handleDeleteModal();
              toast.success("Xoá dự án thành công!");
            }}
          >
            Xoá
          </button>
        </div>
      </div>
    </div>
  );
}
