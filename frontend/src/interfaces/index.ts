export type User = {
  id: string;
  fullname: string;
  email: string;
  password: string;
  image?: string;
  role?: string;
};

export type Task = {
  id: string;
  taskName: string;
  assigneeId: string | "none";
  projectId: string;
  asignDate: string;
  dueDate: string;
  priority: "Low" | "Medium" | "High" | "none";
  progress: "On schedule" | "At risk" | "Delayed" | "none";
  status: "To do" | "In Progress" | "Pending" | "Done" | "none";
};

export type Members = {
  userId: string;
  role: string;
};

export type Project = {
  id: string;
  projectName: string;
  image: string | null;
  description: string;
  members: Members[];
};

//Slice Type
export type AuthType = {
  status: "idle" | "pending" | "success" | "error";
  data: User[];
  allData: User[];
  error: string | undefined;
  currentUser: User | null;
};

export type ProjectType = {
  status: "idle" | "pending" | "success" | "error";
  data: Project[];
  allData: Project[];
  error: string | undefined;
};

export type TaskType = {
  status: "idle" | "pending" | "success" | "error";
  data: Task[];
  allData: Task[];
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
  descriptionError: string | undefined;
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

export const initTask: Omit<Task, "id"> = {
  taskName: "",
  asignDate: "",
  projectId: "",
  assigneeId: "",
  dueDate: "",
  priority: "none",
  status: "none",
  progress: "none",
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
  descriptionError: undefined,
};
