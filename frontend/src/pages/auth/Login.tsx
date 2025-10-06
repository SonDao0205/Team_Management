import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllUsers } from "../../apis/auth.api";
import { useAppDispatch, useAppSelector } from "../../hooks/CustomHook";
import type { Error } from "../../interfaces";
import { toast } from "react-toastify";

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
  const { data } = useAppSelector((state) => state.authSlice);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getAllUsers());
    const userLocal = JSON.parse(localStorage.getItem("user") || "[]");
    if (userLocal.length !== 0) navigate("/team-management");
  }, []);

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
      newError.emailError = "Bạn cần nhập email!";
    }

    if (input.password.trim().length === 0) {
      newError.passwordError = "Bạn cần nhập mật khẩu!";
    }

    const exist = data.some(
      (element) =>
        element.email === input.email && element.password === input.password
    );

    if (!exist) {
      newError.emailError = "Email hoặc mật khẩu không chính xác!";
      newError.passwordError = "Email hoặc mật khẩu không chính xác!";
      toast.error("Đăng nhập thất bại!");
    }

    setError(newError);

    return Object.values(newError).every((value) => value === undefined);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validate()) return;
    toast.success("Đăng nhập thành công!");
    localStorage.setItem("user", JSON.stringify(input));
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
              className={
                error.emailError
                  ? "form-control text-center p-3 border-danger"
                  : "form-control text-center p-3"
              }
              type="text"
              name="email"
              id="email"
              placeholder="Địa chỉ email"
              value={input.email}
              onChange={handleInput}
            />
            {error.emailError && (
              <p className="text-danger">{error.emailError}</p>
            )}
          </div>
          <div>
            <label htmlFor="password">Mật khẩu</label>
            <input
              className={
                error.passwordError
                  ? "form-control text-center p-3 border-danger"
                  : "form-control text-center p-3"
              }
              type="password"
              name="password"
              id="password"
              placeholder="Mật khẩu"
              value={input.password}
              onChange={handleInput}
            />
            {error.passwordError && (
              <p className="text-danger">{error.passwordError}</p>
            )}
          </div>
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
