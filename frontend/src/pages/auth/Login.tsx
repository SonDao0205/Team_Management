import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllUsers } from "../../apis/auth.api";
import { useAppDispatch, useAppSelector } from "../../hooks/CustomHook";
import type { Error } from "../../interfaces";
import { toast } from "react-toastify";
import { loginSuccess } from "../../redux/slices/authSlice";

const initInput = {
  email: "",
  password: "",
};

const initError: Error = {
  fullnameError: undefined,
  emailError: undefined,
  passwordError: undefined,
  confirmPasswordError: undefined,
};

export default function Login() {
  const navigate = useNavigate();
  const [input, setInput] = useState(initInput);
  const [error, setError] = useState<Error>(initError);
  const { data, currentUser } = useAppSelector((state) => state.authSlice);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getAllUsers());
    if (currentUser) {
      navigate("/team-management");
    }
  }, [currentUser]);

  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setInput({
      ...input,
      [name]: value,
    });
  };

  const validate = () => {
    const newError: Error = {
      fullnameError: undefined,
      emailError: undefined,
      passwordError: undefined,
      confirmPasswordError: undefined,
    };

    if (input.email.trim().length === 0) {
      newError.emailError = "Email không được để trống!";
    }

    if (input.password.trim().length === 0) {
      newError.passwordError = "Mật khẩu không được để trống!";
    }

    if (input.email.trim().length !== 0 && input.password.trim().length !== 0) {
      const exist = data.some(
        (element) =>
          element.email === input.email && element.password === input.password
      );

      if (!exist) {
        newError.emailError = "Email hoặc mật khẩu không chính xác!";
        newError.passwordError = "Email hoặc mật khẩu không chính xác!";
        toast.error("Đăng nhập thất bại!");
      }
    }

    setError(newError);

    return Object.values(newError).every((value) => value === undefined);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validate()) return;
    toast.success("Đăng nhập thành công!");

    const exist = data.find(
      (element) =>
        element.email === input.email && element.password === input.password
    );
    if (exist) localStorage.setItem("user", JSON.stringify(exist.id));
    dispatch(loginSuccess(exist));
    setInput(initInput);
    navigate("/team-management");
  };

  return (
    <div className="authWrapper">
      <h2 className="mb-3">Đăng nhập</h2>
      <div className="authContainer">
        <form
          action=""
          className="d-flex flex-column gap-3"
          onSubmit={handleSubmit}
        >
          <div>
            <label htmlFor="email">Email</label>
            <input
              className="form-control text-center p-3"
              type="email"
              name="email"
              id="email"
              placeholder="Địa chỉ email"
              value={input.email}
              onChange={handleInput}
            />
          </div>
          <div>
            <label htmlFor="password">Mật khẩu</label>
            <input
              className="form-control text-center p-3"
              type="password"
              name="password"
              id="password"
              placeholder="Mật khẩu"
              value={input.password}
              onChange={handleInput}
            />
          </div>
          {error.emailError && (
            <p className="text-danger">{error.emailError}</p>
          )}
          <button type="submit" className="btn btn-primary p-3">
            Đăng nhập
          </button>
          <p className="text-center">
            Chưa có tài khoản?{" "}
            <span
              className="text-primary cursor-pointer"
              onClick={() => navigate("/register")}
            >
              Đăng ký
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}
