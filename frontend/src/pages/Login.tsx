import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { useNavigate } from "react-router-dom";
import "../css/global.css";
import "../css/auth.css";

export default function Login() {

  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const authLogin = useAuthStore((state) => state.login);

  const loginUser = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!login || !password) {
      alert("Заполни все поля");
      return;
    }

    try {
      const res = await fetch("http://localhost:8080/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        }, 
        body: JSON.stringify({
          login,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Ошибка входа");
        return;
      }
      authLogin(data.token, data.user);
   //   window.location.href = "/tasks";
      navigate("/tasks", { replace: true });

    }
    catch (err) {
      console.error(err);
      alert("Ошибка сервера");
    }
  };
  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Авторизация</h1>

        <form className="auth-form"  onSubmit={loginUser}>
          <div className="form-group">
            <input type="text" placeholder="Логин"
              value={login}
              onChange={(e) => setLogin(e.target.value)} />
          </div>

          <div className="form-group">
            <input type="password" placeholder="Пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)} />
          </div>

          <button type="submit">Войти</button>
        </form>

        <p>
          Нет аккаунта? <Link to="/register">Зарегистрироваться</Link>
        </p>
      </div>
    </div>
  );
}
