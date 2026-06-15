import { Link, Outlet } from "react-router-dom";

export default function MainLayout() {
  return (
    <div
      style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
    >
      <header
        style={{
          display: "flex",
          gap: "15px",
          padding: "12px 20px",
          background: "#222",
          color: "white",
          alignItems: "center",
        }}
      >
        <strong>Управление задачами</strong>

        <Link style={{ color: "white" }} to="/">
          Домашняя
        </Link>
        <Link style={{ color: "white" }} to="/tasks">
          Задачи
        </Link>
        <Link style={{ color: "white" }} to="/profile">
          Профиль
        </Link>
        <Link style={{ color: "white" }} to="/admin">
          Админ
        </Link>

        <div style={{ marginLeft: "auto", display: "flex", gap: "10px" }}>
          <Link style={{ color: "white" }} to="/login">
            Login
          </Link>
          <Link style={{ color: "white" }} to="/register">
            Register
          </Link>
        </div>
      </header>

      <main style={{ flex: 1, padding: "20px" }}>
        <Outlet />
      </main>
    </div>
  );
}
