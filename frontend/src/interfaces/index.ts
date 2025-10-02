export type User = {
  id: string;
  fullname: string;
  email: string;
  password: string;
};

export type Task = {
  id: string;
  taskName: string;
  assigneeId: string;
  projectId: string;
  asignDate: string;
  dueDate: string;
  priority: "Thấp" | "Trung bình" | "Cao";
  progress: "Đúng tiến độ" | "Có rủi ro" | "Trễ hạn";
  status: "To do" | "In Progress" | "Pending" | "Done";
};

type Members = {
  userId: string;
  role: string;
};

export type Project = {
  id: string;
  projectName: string;
  image: string | null;
  description?: string;
  members: Members[];
};

export type AuthType = {
  status: "idle" | "pending" | "success" | "error";
  data: User[];
  allData: User[];
  error: string | undefined;
};

export type ProjectType = {
  status: "idle" | "pending" | "success" | "error";
  data: Project[];
  allData: Project[];
  error: string | undefined;
};

//Error
export type Error = {
  fullnameError: string | undefined;
  emailError: string | undefined;
  passwordError: string | undefined;
  confirmPasswordError: string | undefined;
};

export type ErrorProject = {
  projectNameError: string | undefined;
  imageError: string | undefined;
};

//Init object
export const initUser: Omit<User, "id"> = {
  fullname: "",
  email: "",
  password: "",
};

export const initProject: Omit<Project, "id"> = {
  projectName: "",
  image: "",
  description: "",
  members: [],
};

export const initError: Error = {
  fullnameError: undefined,
  emailError: undefined,
  passwordError: undefined,
  confirmPasswordError: undefined,
};

export const initErrorProject: ErrorProject = {
  projectNameError: undefined,
  imageError: undefined,
};
