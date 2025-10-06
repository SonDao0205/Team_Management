import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../hooks/CustomHook";
import { addMember, getAllProjects } from "../apis/project.api";
import { getAllUsers } from "../apis/auth.api";
import type { Members } from "../interfaces";
import { toast } from "react-toastify";

type Props = {
  handleToggleModalAddMember: () => void;
  projectId: string | undefined;
};

type Error = {
  emailError: string | undefined;
  roleError: string | undefined;
};

const initError: Error = {
  emailError: undefined,
  roleError: undefined,
};

export default function ModalAddMember({
  handleToggleModalAddMember,
  projectId,
}: Props) {
  //Data
  const { data } = useAppSelector((state) => state.projectSlice);
  const userState = useAppSelector((state) => state.authSlice);
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(getAllProjects());
    dispatch(getAllUsers());
  }, []);

  //Form
  const [error, setError] = useState<Error>(initError);
  const [emailInput, setEmailInput] = useState<string>("");
  const [roleInput, setRoleInput] = useState<string>("");

  const validate = () => {
    const newError: Error = {
      emailError: undefined,
      roleError: undefined,
    };
    if (emailInput.trim().length === 0) {
      newError.emailError = "Email không được bỏ trống!";
    }
    if (roleInput.trim().length === 0) {
      newError.roleError = "Vai trò không được bỏ trống!";
    }
    //Find user bằng email
    const findUser = userState.data.find(
      (element) => element.email === emailInput
    );
    if (!findUser) {
      newError.emailError = "Email không tồn tại";
    } else {
      // Find project hiện tại
      const findProject = data.find((element) => element.id === projectId);

      if (findProject) {
        // Kiểm tra tồn tại của thành viên trong nhóm dự án
        const members = [...findProject.members];
        const existMember = members.find(
          (element) => element.userId === findUser.id
        );
        console.log(existMember);

        if (existMember) {
          newError.emailError = "Thành viên đã tồn tại!";
        }
      }
    }
    setError(newError);
    return Object.values(newError).every((value) => value === undefined);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const findUser = userState.data.find(
      (element) => element.email === emailInput
    );

    if (!validate() || !findUser) return;

    const newMember: Members = {
      userId: findUser.id,
      role: roleInput,
    };
    dispatch(addMember({ member: newMember, projectId }));
    toast.success("Thêm thành viên thành công!");
    setEmailInput("");
    setRoleInput("");
    handleToggleModalAddMember();
  };

  return (
    <div>
      <div className="overlay" onClick={handleToggleModalAddMember}></div>
      <div className="modal-container border border-secondary rounded p-2">
        <header className="d-flex justify-content-between border-bottom mb-3 p-2">
          <h4>Thêm thành viên</h4>
          <button
            className="btn btn-close"
            onClick={handleToggleModalAddMember}
          ></button>
        </header>
        <form onSubmit={handleSubmit}>
          <div className="d-flex flex-column gap-4 p-3 border-bottom mb-3">
            <div>
              <label htmlFor="emailMember">Email</label>
              <input
                type="email"
                className="form-control"
                name="emailMember"
                id="emailMember"
                placeholder="Nhập email nhân viên"
                value={emailInput}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                  setEmailInput(event.target.value)
                }
              />
              {error.emailError && (
                <p className="text-danger">{error.emailError}</p>
              )}
            </div>
            <div>
              <label htmlFor="role">Vai trò</label>
              <input
                type="text"
                className="form-control"
                name="role"
                id="role"
                placeholder="Nhập vai trò của nhân viên"
                value={roleInput}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                  setRoleInput(event.target.value)
                }
              />
              {error.roleError && (
                <p className="text-danger">{error.roleError}</p>
              )}
            </div>
          </div>
          <div className="d-flex justify-content-end gap-3 p-2">
            <button
              className="btn btn-secondary"
              onClick={handleToggleModalAddMember}
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
