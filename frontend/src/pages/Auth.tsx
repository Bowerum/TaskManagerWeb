import { useNavigate } from "react-router-dom";
import "../css/global.css";
import "../css/auth.css";

export default function Auth() {
  
  const navigate = useNavigate();

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Система управления задачами</h1>

        <div className="auth-buttons">
            <button onClick={() => navigate("/login", { replace: true })}>Войти</button>

            <button onClick={() => navigate("/register", { replace: true })}>Регистрация</button>
        </div>
      </div>
    </div>
  );
}
