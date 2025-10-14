import { useEffect, useState } from "react";
import { initError, initUser, type Error, type User } from "../../interfaces";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks/CustomHook";
import { addUser, getAllUsers } from "../../apis/auth.api";
import { toast } from "react-toastify";
import { loginSuccess } from "../../redux/slices/authSlice";

export default function Register() {
  const [newUser, setNewUser] = useState<Omit<User, "id">>(initUser);
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [error, setError] = useState<Error>(initError);
  const navigate = useNavigate();
  const { data } = useAppSelector((state) => state.authSlice);
  const dispatch = useAppDispatch();

  const fetchData = async () => {
    await dispatch(getAllUsers());
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setNewUser({
      ...newUser,
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

    if (newUser.fullname.trim().length === 0) {
      newError.fullnameError = "Bạn cần nhập tên đầy đủ!";
    }

    if (newUser.email.trim().length === 0) {
      newError.emailError = "Bạn cần nhập email!";
    } else if (!newUser.email.trim().endsWith("@gmail.com")) {
      newError.emailError = "Bạn cần nhập đúng định dạng email!";
    }

    if (newUser.password.trim().length === 0) {
      newError.passwordError = "Bạn cần nhập mật khẩu!";
    } else if (newUser.password.trim().length < 8) {
      newError.passwordError = "Bạn cần nhập mật khẩu tối thiểu 8 ký tự!";
    }

    if (confirmPassword.trim().length === 0) {
      newError.confirmPasswordError = "Bạn cần nhập xác nhận mật khẩu!";
    } else if (newUser.password !== confirmPassword) {
      newError.confirmPasswordError = "Mật khẩu xác nhận không khớp!";
    }

    const exist = data.find((element) => element.email === newUser.email);
    if (exist) {
      newError.emailError = "Email đã tồn tại!";
    }

    setError(newError);

    return Object.values(newError).every((value) => value === undefined);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validate()) return;

    try {
      const action = await dispatch(addUser(newUser));
      const createdUser = action.payload;
      if (createdUser && createdUser.id) {
        localStorage.setItem("user", JSON.stringify(createdUser.id));
        dispatch(loginSuccess(createdUser));
        toast.success("Đăng ký thành công!");
        setNewUser(initUser);
        setConfirmPassword("");
        navigate("/team-management");
      } else {
        toast.error("Đăng ký thất bại, vui lòng thử lại!");
      }
    } catch (error) {
      console.error("Register error:", error);
      toast.error("Đăng ký thất bại!");
    }
  };

  return (
    <div className="authWrapper">
      <h2 className="mb-3">Đăng ký</h2>
      <div className="authContainer">
        <form
          action=""
          className="d-flex flex-column gap-4"
          onSubmit={handleSubmit}
        >
          <div>
            <input
              className={
                error.fullnameError
                  ? "form-control text-center p-3 border-danger"
                  : "form-control text-center p-3"
              }
              type="text"
              name="fullname"
              id="fullname"
              placeholder="Họ và tên"
              value={newUser.fullname}
              onChange={handleInput}
            />
            {error.fullnameError && (
              <p className="text-danger">{error.fullnameError}</p>
            )}
          </div>
          <div>
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
              value={newUser.email}
              onChange={handleInput}
            />
            {error.emailError && (
              <p className="text-danger">{error.emailError}</p>
            )}
          </div>
          <div>
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
              value={newUser.password}
              onChange={handleInput}
            />
            {error.passwordError && (
              <p className="text-danger">{error.passwordError}</p>
            )}
          </div>
          <div>
            <input
              className={
                error.confirmPasswordError
                  ? "form-control text-center p-3 border-danger"
                  : "form-control text-center p-3"
              }
              type="password"
              name="confirmPassword"
              id="confirmPassword"
              placeholder="Xác nhận mật khẩu"
              value={confirmPassword}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                setConfirmPassword(event.target.value)
              }
            />
            {error.confirmPasswordError && (
              <p className="text-danger">{error.confirmPasswordError}</p>
            )}
          </div>
          <button type="submit" className="btn btn-primary p-3">
            Đăng ký
          </button>
          <p className="text-center">
            Chưa có tài khoản?{" "}
            <span
              className="text-primary cursor-pointer"
              onClick={() => navigate("/")}
            >
              Đăng nhập
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}
