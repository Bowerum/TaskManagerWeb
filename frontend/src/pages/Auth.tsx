import { Link } from "react-router-dom";
import "../css/global.css";
import "../css/auth.css";

export default function Auth() {
  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Система управления задачами</h1>

        <div className="auth-buttons">
          <Link to="/login">
            <button>Войти</button>
          </Link>

          <Link to="/register">
            <button>Регистрация</button>
          </Link>
        </div>
      </div>
    </div>
  );
}
