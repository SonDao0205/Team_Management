import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch } from "../hooks/CustomHook";
import { logOut } from "../redux/slices/authSlice";

export default function Header() {
  const [userId, setUserId] = useState<string | undefined>(undefined);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "[]");
    if (user) setUserId(user);
  });
  const location = useLocation();

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
          onClick={() =>
            navigate(`/team-management/personal-mission/${userId}`)
          }
        >
          Nhiệm Vụ của tôi
        </button>
        <button
          className="btn btn-link text-decoration-none text-white"
          onClick={() => {
            dispatch(logOut());
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
