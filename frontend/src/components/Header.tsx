import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();
  useEffect(() => {
    const userLocal = JSON.parse(localStorage.getItem("user") || "[]");
    if (userLocal.length === 0) navigate("/");
  });
  const location = useLocation();
  console.log(location.pathname);

  return (
    <div
      className="d-flex justify-content-around align-items-center p-2"
      style={{ backgroundColor: "#212529" }}
    >
      <h2 className="text-white">Quản lý dự án</h2>
      <div>
        <button
          className={
            location.pathname.includes("projects")
              ? "btn btn-link text-decoration-none text-secondary"
              : "btn btn-link text-decoration-none text-white"
          }
          onClick={() => navigate("projects")}
        >
          Dự Án
        </button>
        <button
          className={
            location.pathname.includes("personal-mission")
              ? "btn btn-link text-decoration-none text-secondary"
              : "btn btn-link text-decoration-none text-white"
          }
          onClick={() => navigate("personal-mission")}
        >
          Nhiệm Vụ của tôi
        </button>
        <button
          className="btn btn-link text-decoration-none text-white"
          onClick={() => {
            localStorage.removeItem("user");
            navigate("/");
          }}
        >
          Đăng Xuất
        </button>
      </div>
    </div>
  );
}
