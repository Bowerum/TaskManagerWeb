import { NavLink } from "react-router-dom";
import { useAuthStore, Role } from "../store/authStore";

export default function Panel() {
    const user = useAuthStore((state) => state.user);

    if (!user) return null;

    const menuItems = [
        {
            title: "Мои задачи",
            path: "/my-tasks",
            roles: [Role.Executor, Role.Manager],
        },
        {
            title: "Все задачи",
            path: "/tasks",
            roles: [Role.Manager, Role.Admin],
        },
        {
            title: "Пользователи",
            path: "/users",
            roles: [Role.Admin],
        },
    ];

    return (
        <div className="panel">
            {menuItems
                .filter((item) => item.roles.includes(user.roleId))
                .map((item) => (
                    <NavLink key={item.path} to={item.path}
                        className={({ isActive }) => isActive ? "panel-link active" : "panel-link"}>
                        {item.title}
                    </NavLink>
                ))}
        </div>
    );
}