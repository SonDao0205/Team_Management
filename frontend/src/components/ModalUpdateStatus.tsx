import { toast } from "react-toastify";
import { updateStatus } from "../apis/task.api";
import { useAppDispatch } from "../hooks/CustomHook";

type Props = {
  handleToggleModal: () => void;
  taskId: string | undefined;
};

export default function ModalUpdateStatus({
  handleToggleModal,
  taskId,
}: Props) {
  console.log(taskId);
  const dispatch = useAppDispatch();
  const handleUpdate = () => {
    if (!taskId) {
      toast.error("Không tìm thấy id của Task!");
      return;
    }
    dispatch(updateStatus(taskId));
    toast.success("Cập nhật trạng thái thành công!");
    handleToggleModal();
  };

  return (
    <div>
      <div className="overlay"></div>
      <div
        className="modal-container border border-secondary rounded p-2"
        style={{ top: "20%" }}
      >
        <header className="d-flex justify-content-between border-bottom mb-3 p-2">
          <h4>Cập nhật trạng thái</h4>
          <button
            className="btn btn-close"
            onClick={handleToggleModal}
          ></button>
        </header>
        <div className="border-bottom mb-3 p-2">
          <p>Xác nhận cập nhật trạng thái nhiệm vụ!</p>
        </div>
        <div className="d-flex justify-content-end gap-3 p-2">
          <button className="btn btn-secondary" onClick={handleToggleModal}>
            Huỷ
          </button>
          <button className="btn btn-primary" onClick={handleUpdate}>
            Cập nhật
          </button>
        </div>
      </div>
    </div>
  );
}
