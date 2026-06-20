import { useEffect, useState } from "react";
import { getMyTasks } from "../api/taskApi";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

export default function MyTasks() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
const user = useAuthStore(state => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    load();
  }, []);

  async function load() {
    try {
      if(user != null)
      {
      const data = await getMyTasks(user.userId);
      console.log(data)
      setTasks(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <div>Loading...</div>;

  return (
    <div className="task-list">
      <h1>Мои задачи</h1>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Название</th>
            <th>Статус</th>
            <th>Дедлайн</th>
            <th>Действия</th>
          </tr>
        </thead>

        <tbody>
          {(tasks ?? []).length === 0 ? (
            <tr>
              <td colSpan={6} className="empty">
                Задач нет
              </td>
            </tr>
          ) : (tasks.map((t) => (
            <tr key={t.taskId}>
              <td>{t.taskId}</td>
              <td>{t.title}</td>
              <td>{t.status}</td>
              <td>
                {t.dueDate
                  ? new Date(t.dueDate).toLocaleDateString()
                  : "-"}
              </td>

              <td>
                <button onClick={() => navigate(`/tasks/${t.taskId}`)}>
                  Открыть
                </button>
              </td>
            </tr>
          ))
          )}
        </tbody>
      </table>
    </div>
  );
}