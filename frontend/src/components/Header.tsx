import { useNavigate } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();
  return (
    <div
      className="d-flex justify-content-around align-items-center p-2"
      style={{ backgroundColor: "#212529" }}
    >
      <h2 className="text-white">Quản lý dự án</h2>
      <div>
        <button
          className="btn btn-link text-decoration-none text-white"
          onClick={() => navigate("projects")}
        >
          Dự Án
        </button>
        <button
          className="btn btn-link text-decoration-none text-white"
          onClick={() => navigate("personal-mission")}
        >
          Nhiệm Vụ của tôi
        </button>
        <button
          className="btn btn-link text-decoration-none text-white"
          onClick={() => navigate("/")}
        >
          Đăng Xuất
        </button>
      </div>
    </div>
  );
}
