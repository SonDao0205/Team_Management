import { useState } from "react";
import type { Task, User } from "../interfaces";
import ModalDelete from "./ModalDelete";

type Props = {
  tasksByStatus: {
    "To do": Task[];
    "In Progress": Task[];
    Pending: Task[];
    Done: Task[];
  };
  userData: User[];
  handleSetEditId: (id: string) => void;
};

export default function TableDetails({
  tasksByStatus,
  userData,
  handleSetEditId,
}: Props) {
  const [openTodo, setOpenTodo] = useState(false);
  const [openInProgress, setOpenInProgress] = useState(false);
  const [openPending, setOpenPending] = useState(false);
  const [openDone, setOpenDone] = useState(false);
  const [toggleModal, setToggleModal] = useState<boolean>(false);
  const [deleteId, setDeleteId] = useState<string | undefined>(undefined);
  const handleToggleModal = () => {
    setToggleModal(toggleModal ? false : true);
  };

  return (
    <>
      <table className="table">
        <thead>
          <tr className="table-light">
            <th>Tên Nhiệm Vụ</th>
            <th>Người Phụ Trách</th>
            <th>Ưu Tiên</th>
            <th>Ngày Bắt Đầu</th>
            <th>Hạn Chót</th>
            <th>Tiến Độ</th>
            <th>Hành Động</th>
          </tr>
        </thead>

        {/* TO DO */}
        <tbody className={openTodo ? "tbody-expand" : "tbody-collapse"}>
          <tr
            style={{
              cursor: "pointer",
              backgroundColor: "#f6f6f6",
              fontWeight: "bold",
            }}
            onClick={() => setOpenTodo(!openTodo)}
          >
            <td colSpan={7}>{openTodo ? "▼" : "▶"} To do</td>
          </tr>
          {openTodo &&
            (tasksByStatus["To do"].length > 0 ? (
              tasksByStatus["To do"].map((task) => (
                <tr key={task.id}>
                  <td className="align-middle">{task.taskName}</td>
                  <td className="align-middle">
                    {userData?.find((u) => u.id === task.assigneeId)
                      ?.fullname || (
                      <span className="text-muted fst-italic">
                        Chưa có người phụ trách
                      </span>
                    )}
                  </td>
                  <td className="align-middle">
                    <span
                      className={`badge ${
                        task.priority === "Low"
                          ? "bg-info"
                          : task.priority === "Medium"
                            ? "bg-warning"
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
                  <td className="text-primary align-middle">
                    {task.asignDate}
                  </td>
                  <td className="text-primary align-middle">{task.dueDate}</td>
                  <td className="align-middle">
                    <span
                      className={`badge ${
                        task.progress === "On schedule"
                          ? "bg-success"
                          : task.progress === "At risk"
                            ? "bg-warning"
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
                  <td className="d-flex gap-2">
                    <button
                      className="btn btn-sm btn-warning"
                      onClick={() => handleSetEditId(task.id)}
                    >
                      Sửa
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => {
                        handleToggleModal();
                        setDeleteId(task.id);
                      }}
                    >
                      Xoá
                    </button>
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

        {/* IN PROGRESS */}
        <tbody className={openInProgress ? "tbody-expand" : "tbody-collapse"}>
          <tr
            style={{
              cursor: "pointer",
              backgroundColor: "#f6f6f6",
              fontWeight: "bold",
            }}
            onClick={() => setOpenInProgress(!openInProgress)}
          >
            <td colSpan={7}>{openInProgress ? "▼" : "▶"} In Progress</td>
          </tr>
          {openInProgress &&
            (tasksByStatus["In Progress"].length > 0 ? (
              tasksByStatus["In Progress"].map((task) => (
                <tr key={task.id}>
                  <td className="align-middle">{task.taskName}</td>
                  <td className="align-middle">
                    {userData?.find((u) => u.id === task.assigneeId)
                      ?.fullname || (
                      <span className="text-muted fst-italic">
                        Chưa có người phụ trách
                      </span>
                    )}
                  </td>
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
                  <td className="text-primary align-middle">
                    {task.asignDate}
                  </td>
                  <td className="text-primary align-middle">{task.dueDate}</td>
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
                  <td className="d-flex gap-2">
                    <button
                      className="btn btn-sm btn-warning"
                      onClick={() => handleSetEditId(task.id)}
                    >
                      Sửa
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => {
                        handleToggleModal();
                        setDeleteId(task.id);
                      }}
                    >
                      Xoá
                    </button>
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

        {/* PENDING */}
        <tbody className={openPending ? "tbody-expand" : "tbody-collapse"}>
          <tr
            style={{
              cursor: "pointer",
              backgroundColor: "#f6f6f6",
              fontWeight: "bold",
            }}
            onClick={() => setOpenPending(!openPending)}
          >
            <td colSpan={7}>{openPending ? "▼" : "▶"} Pending</td>
          </tr>
          {openPending &&
            (tasksByStatus["Pending"].length > 0 ? (
              tasksByStatus["Pending"].map((task) => (
                <tr key={task.id}>
                  <td className="align-middle">{task.taskName}</td>
                  <td className="align-middle">
                    {userData?.find((u) => u.id === task.assigneeId)
                      ?.fullname || (
                      <span className="text-muted fst-italic">
                        Chưa có người phụ trách
                      </span>
                    )}
                  </td>
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
                  <td className="text-primary align-middle">
                    {task.asignDate}
                  </td>
                  <td className="text-primary align-middle">{task.dueDate}</td>
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
                  <td className="d-flex gap-2">
                    <button
                      className="btn btn-sm btn-warning"
                      onClick={() => handleSetEditId(task.id)}
                    >
                      Sửa
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => {
                        handleToggleModal();
                        setDeleteId(task.id);
                      }}
                    >
                      Xoá
                    </button>
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

        {/* DONE */}
        <tbody className={openDone ? "tbody-expand" : "tbody-collapse"}>
          <tr
            style={{
              cursor: "pointer",
              backgroundColor: "#f6f6f6",
              fontWeight: "bold",
            }}
            onClick={() => setOpenDone(!openDone)}
          >
            <td colSpan={7}>{openDone ? "▼" : "▶"} Done</td>
          </tr>
          {openDone &&
            (tasksByStatus["Done"].length > 0 ? (
              tasksByStatus["Done"].map((task) => (
                <tr key={task.id}>
                  <td className="align-middle">{task.taskName}</td>
                  <td className="align-middle">
                    {userData?.find((u) => u.id === task.assigneeId)
                      ?.fullname || (
                      <span className="text-muted fst-italic">
                        Chưa có người phụ trách
                      </span>
                    )}
                  </td>
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
                  <td className="text-primary align-middle">
                    {task.asignDate}
                  </td>
                  <td className="text-primary align-middle">{task.dueDate}</td>
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
                  <td className="d-flex gap-2">
                    <button
                      className="btn btn-sm btn-warning"
                      onClick={() => handleSetEditId(task.id)}
                    >
                      Sửa
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => {
                        handleToggleModal();
                        setDeleteId(task.id);
                      }}
                    >
                      Xoá
                    </button>
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
      </table>
      {toggleModal && (
        <ModalDelete
          handleDeleteModal={handleToggleModal}
          deleteId={deleteId}
          name="task"
        />
      )}
    </>
  );
}
