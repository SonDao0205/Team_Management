import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute() {
  const user = JSON.parse(localStorage.getItem("user") || "[]");

  return user.length !== 0 ? <Outlet /> : <Navigate to="/" replace />;
}
