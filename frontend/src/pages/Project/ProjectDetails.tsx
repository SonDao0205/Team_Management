import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { Project } from "../../interfaces";
import { useAppDispatch, useAppSelector } from "../../hooks/CustomHook";
import { getAllProjects } from "../../apis/project.api";

export default function ProjectDetails() {
  const { id } = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const { data } = useAppSelector((state) => state.projectSlice);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (data.length === 0) {
      dispatch(getAllProjects());
    } else {
      const findProject = data.find((element) => element.id === id);
      if (findProject) setProject(findProject);
    }
  }, [data, id]);

  //Accordion button
  const [openTodo, setOpenTodo] = useState(false);
  const [openInProgress, setOpenInProgress] = useState(false);
  const [openPending, setOpenPending] = useState(false);
  const [openDone, setOpenDone] = useState(false);

  return (
    <main className="d-flex flex-column gap-3">
      <header style={{ gap: "15%" }} className="d-flex jusitfy-content-between">
        <section style={{ width: "60%" }} className="d-flex flex-column gap-3">
          <h4>{project?.projectName}</h4>
          <div className="d-flex gap-2">
            <img
              style={{ width: "300px" }}
              src={String(project?.image)}
              alt={project?.projectName}
            />
            <p>{project?.description}</p>
          </div>
          <button className="btn btn-primary w-45">+ Thêm nhiệm vụ</button>
        </section>
        <section style={{ width: "40%" }}>
          <div className="d-flex justify-content-between">
            <h4>Thành viên</h4>
            <button className="btn btn-outline-secondary">
              + Thêm thành viên
            </button>
          </div>

          <div className="d-flex gap-2"></div>
        </section>
      </header>
      <div
        style={{ boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px" }}
        className="p-3 rounded"
      >
        <h4>Danh sách nhiệm vụ</h4>
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

            {openTodo && (
              <>
                <tr>
                  <td className="align-middle">Soạn thảo đề cương dự án</td>
                  <td className="align-middle">An Nguyễn</td>
                  <td className="align-middle">
                    <span className="badge bg-info">Thấp</span>
                  </td>
                  <td className="text-primary align-middle">02 - 24</td>
                  <td className="text-primary align-middle">02 - 27</td>
                  <td className="align-middle">
                    <span className="badge bg-success">Đúng tiến độ</span>
                  </td>
                  <td className="d-flex gap-2">
                    <button className="btn btn-sm btn-warning">Sửa</button>
                    <button className="btn btn-sm btn-danger">Xoá</button>
                  </td>
                </tr>
                <tr>
                  <td className="align-middle">Soạn thảo đề cương dự án</td>
                  <td className="align-middle">An Nguyễn</td>
                  <td className="align-middle">
                    <span className="badge bg-warning text-dark">
                      Trung bình
                    </span>
                  </td>
                  <td className="text-primary align-middle">02 - 24</td>
                  <td className="text-primary align-middle">02 - 27</td>
                  <td className="align-middle">
                    <span className="badge bg-warning text-dark">
                      Có rủi ro
                    </span>
                  </td>
                  <td className="d-flex gap-2">
                    <button className="btn btn-sm btn-warning">Sửa</button>
                    <button className="btn btn-sm btn-danger">Xoá</button>
                  </td>
                </tr>
                <tr>
                  <td className="align-middle">Soạn thảo đề cương dự án</td>
                  <td className="align-middle">An Nguyễn</td>
                  <td className="align-middle">
                    <span className="badge bg-danger">Cao</span>
                  </td>
                  <td className="text-primary align-middle">02 - 24</td>
                  <td className="text-primary align-middle">02 - 27</td>
                  <td className="align-middle">
                    <span className="badge bg-danger">Trễ hạn</span>
                  </td>
                  <td className="d-flex gap-2">
                    <button className="btn btn-sm btn-warning">Sửa</button>
                    <button className="btn btn-sm btn-danger">Xoá</button>
                  </td>
                </tr>
              </>
            )}
          </tbody>

          {/* IN PROGRESS */}
          <tbody>
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

            {openInProgress && (
              <>
                <tr>
                  <td className="align-middle">Lên lịch họp kickoff</td>
                  <td className="align-middle">An Nguyễn</td>
                  <td className="align-middle">
                    <span className="badge bg-warning text-dark">
                      Trung bình
                    </span>
                  </td>
                  <td className="text-primary align-middle">02 - 24</td>
                  <td className="text-primary align-middle">02 - 27</td>
                  <td className="align-middle">
                    <span className="badge bg-warning text-dark">
                      Có rủi ro
                    </span>
                  </td>
                  <td className="d-flex gap-2">
                    <button className="btn btn-sm btn-warning">Sửa</button>
                    <button className="btn btn-sm btn-danger">Xoá</button>
                  </td>
                </tr>
              </>
            )}
          </tbody>

          {/* PENDING */}
          <tbody>
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

            {openPending && (
              <>
                {/* Không có nhiệm vụ */}
                <tr>
                  <td colSpan={7} className="text-muted">
                    Không có nhiệm vụ nào.
                  </td>
                </tr>
              </>
            )}
          </tbody>

          {/* DONE */}
          <tbody>
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

            {openDone && (
              <>
                {/* Không có nhiệm vụ */}
                <tr>
                  <td colSpan={7} className="text-muted">
                    Không có nhiệm vụ nào.
                  </td>
                </tr>
              </>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
