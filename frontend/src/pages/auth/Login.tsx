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

    setError(newError);

    return Object.values(newError).every((value) => value === undefined);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validate()) return;
    const exist = data.some(
      (element) =>
        element.email === input.email && element.password === input.password
    );
    if (!exist) {
      toast.error("Đăng nhập thất bại");
      return;
    }
    toast.success("Đăng nhập thành công!");
    setInput(initInput);
    setTimeout(() => {
      navigate("/team-management");
    }, 3200);
  };

  return (
    <div className="authWrapper">
      <h1>Đăng nhập</h1>
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
              type="text"
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
          <button type="submit" className="btn btn-primary">
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
