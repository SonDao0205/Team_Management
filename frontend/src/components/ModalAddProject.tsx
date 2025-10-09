import { useEffect, useState } from "react";
import {
  initErrorProject,
  initProject,
  type ErrorProject,
  type Project,
} from "../interfaces";
import axios from "axios";
import { toast } from "react-toastify";

type Props = {
  handleToggleModal: () => void;
  handleAddProject: (newProject: Omit<Project, "id">) => void;
  data: Project[];
  editId: string | undefined;
};

export default function ModalAddProject({
  handleToggleModal,
  handleAddProject,
  data,
  editId,
}: Props) {
  const [newProject, setNewProject] =
    useState<Omit<Project, "id">>(initProject);
  const [error, setError] = useState<ErrorProject>(initErrorProject);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (!editId) return;
    const findProject = data.find((element) => element.id === editId);
    if (!findProject) return;
    setNewProject(findProject);
  }, [editId]);

  const validate = () => {
    setError(initErrorProject);
    const newError: ErrorProject = {
      projectNameError: undefined,
      imageError: undefined,
      descriptionError: undefined,
    };
    if (newProject.projectName.trim().length === 0) {
      newError.projectNameError = "Bạn cần nhập tên dự án!";
    } else if (newProject.projectName.trim().length <= 3) {
      newError.projectNameError = "Tên dự án quá ngắn, không hợp lệ!";
    }

    if (newProject.image?.trim().length === 0) {
      newError.imageError = "Bạn cần thêm ảnh dự án!";
    }

    if (newProject.description.trim().length === 0) {
      newError.descriptionError = "Bạn cần nhập mô tả dự án!";
    } else if (newProject.description.trim().length <= 3) {
      newError.descriptionError = "Mô tả dự án quá ngắn, không hợp lệ!";
    }

    const exist = data.find(
      (element) => element.projectName === newProject.projectName
    );

    if (exist) {
      newError.projectNameError = "Tên dự án đã tồn tại";
    }

    setError(newError);
    return Object.values(newError).every((value) => value === undefined);
  };

  useEffect(() => {
    if (isUploading)
      setError({ ...error, imageError: "Đang upload ảnh, vui lòng chờ!" });
    else setError({ ...error, imageError: undefined });
  }, [isUploading]);

  const handleUploadImage = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setIsUploading(true);

      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("upload_preset", "sondao1");
      try {
        const res = await axios.post(
          `https://api.cloudinary.com/v1_1/dq87endkv/image/upload`,
          formData
        );
        setNewProject({ ...newProject, image: res.data.secure_url });
        setError({ ...error, imageError: undefined });
      } catch (err) {
        console.error("Upload error:", err);
        setError({ ...error, imageError: "Lỗi khi upload ảnh!" });
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isUploading) {
      if (!validate()) return;
      toast.success(
        editId ? "Sửa dự án thành công!" : "Thêm dự án thành công!"
      );
      handleAddProject(newProject);
      setNewProject(initProject);
      setError(initErrorProject);
    } else {
      toast.warning("Đang upload ảnh, vui lòng chờ!");
    }
  };

  return (
    <div>
      <div className="overlay" onClick={handleToggleModal}></div>
      <div className="modal-container border border-secondary rounded p-2">
        <header className="d-flex justify-content-between border-bottom mb-3 p-2">
          <h4>Thêm/Sửa dự án</h4>
          <button
            className="btn btn-close"
            onClick={handleToggleModal}
          ></button>
        </header>
        <form action="" onSubmit={handleSubmit}>
          <div className="d-flex flex-column gap-4 p-3 border-bottom mb-3">
            <div>
              <label htmlFor="projectName">Tên dự án</label>
              <input
                className={
                  error.projectNameError
                    ? "form-control border-danger"
                    : "form-control"
                }
                type="text"
                name="projectName"
                id="projectName"
                value={newProject.projectName}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                  setNewProject({
                    ...newProject,
                    [event.target.name]: event.target.value,
                  })
                }
              />
              {error.projectNameError && (
                <p className="text-danger">{error.projectNameError}</p>
              )}
            </div>
            <div>
              <label htmlFor="image" className="form-label">
                Hình ảnh dự án
              </label>
              <input
                className={
                  error.imageError
                    ? "form-control border-danger"
                    : "form-control"
                }
                type="file"
                id="image"
                name="image"
                onChange={handleUploadImage}
              ></input>
              {error.imageError && (
                <p className="text-danger">{error.imageError}</p>
              )}
            </div>
            <div>
              <label htmlFor="desciption">Mô tả dự án</label>
              <textarea
                className={
                  error.descriptionError
                    ? "form-control border-danger"
                    : "form-control"
                }
                id="desciption"
                name="description"
                style={{ height: "100px" }}
                value={newProject.description}
                onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) =>
                  setNewProject({
                    ...newProject,
                    [event.target.name]: event.target.value,
                  })
                }
              ></textarea>
              {error.descriptionError && (
                <p className="text-danger">{error.descriptionError}</p>
              )}
            </div>
          </div>
          <div className="d-flex justify-content-end gap-3 p-2">
            <button
              className="btn btn-secondary"
              onClick={() => {
                handleToggleModal();
              }}
            >
              Huỷ
            </button>
            <button type="submit" className="btn btn-primary">
              Lưu
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
