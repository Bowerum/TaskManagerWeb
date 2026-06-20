import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { Role, RoleNames, useAuthStore } from "../store/authStore";

const defaultRouteByRole: Record<Role, string> = {
  [Role.Executor]: "/my-tasks",
  [Role.Manager]: "/tasks",
  [Role.Admin]: "/tasks",
};

export default function RoleGuard({
  allowedRoles,
}: {
  allowedRoles: number[];
}) {
  const user = useAuthStore((state) => state.user);

  if (!user) {
    return <Navigate to="/login" replace />;
  }
  const navigate = useNavigate();
  const hasAccess = allowedRoles.includes(user.roleId);

  if (!hasAccess) {
    
    const fallback = defaultRouteByRole[user.roleId] ?? "/login";

    return (

      <div style={{ textAlign: "center", marginTop: "2rem" }}>
        <h2> Доступ запрещён</h2>
        <p>У вас недостаточно прав для просмотра этой страницы.</p>
        <p>Ваша роль: {RoleNames[user.roleId]}</p>
        <button onClick={() => navigate(fallback)}>Назад</button>
      </div>
    );
  }

  return <Outlet />;
}