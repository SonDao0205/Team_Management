import { createBrowserRouter } from "react-router-dom";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import TeamManagement from "../layouts/TeamManagement";
import ProjectManagement from "../pages/Project/ProjectManagement";
import ProjectDetails from "../pages/Project/ProjectDetails";
import PersonalMission from "../pages/PersonalMission";

export const routers = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/team-management",
    element: <TeamManagement />,
    children: [
      {
        index: true,
        element: <ProjectManagement />,
      },
      {
        path: "projects",
        element: <ProjectManagement />,
      },
      {
        path: "projects/:id",
        element: <ProjectDetails />,
      },
      {
        path: "personal-mission",
        element: <PersonalMission />,
      },
    ],
  },
]);
