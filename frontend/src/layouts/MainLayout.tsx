import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { Role, RoleNames, useAuthStore } from "../store/authStore";
import "../css/layout.css";
import Panel from "../components/Panel";

export default function MainLayout() {

  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });

    if (!user) return null;

  };

  return (
    <div className="layout">

      <header className="header">
        <div className="header-left">
          <h2>Управление задачами</h2>
          <p className="user">
            {user && `${user.firstName} ${user.lastName} ${RoleNames[user.roleId]}`}
          </p>
        </div>

        <button className="logout" onClick={handleLogout}>
          Выйти
        </button>
      </header>

      <Panel />
      {/*  <NavLink to="/tasks">Все задачи</NavLink>
        <NavLink to="/my-tasks">Мои задачи</NavLink>
       {/* <NavLink to="/tasks/create">Создать задачу</NavLink> 
        <NavLink to="/users">Все пользователи</NavLink>*/}
      <main className="content">
        <Outlet />
      </main>
    </div>
  );
}
