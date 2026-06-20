import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import { deleteTask, getTasks } from "../api/taskApi";
import { getUsers, type UserResponse } from "../api/userApi";
import { useAuthStore } from "../store/authStore";

import type { TaskResponse } from "../types/task.ts";
import "../css/tasks.css";

export default function Tasks() {
  console.log("RENDER TASKS");

  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();

  const [users, setUsers] = useState<UserResponse[]>([]);
  const [tasks, setTasks] = useState<TaskResponse[]>([]);

  const [loading, setLoading] = useState(true);

  const [status, setStatus] = useState('');
  const [assigneeId, setAssigneeId] = useState('');
  const [title, setTitle] = useState("");

  useEffect(() => {
    console.log("LOAD DATA EFFECT");
    loadData();
  }, []);

  async function loadData() {
    try {
      const [tasksData, usersData] = await Promise.all([
        getTasks(),
        getUsers(),
      ]);
      console.log('usersData:', usersData);
      console.log('tasksData:', tasksData);
      setTasks(tasksData);
      setUsers(usersData);
    } catch (e) {
      console.error('Ошибка загрузки данных', e);
    } finally {
      setLoading(false);
    }
  }

  const loadTasks = async (title?: string, assignee?: number, statusId?: number) => {

    try {
      setLoading(true);

      const data = await getTasks(title, assignee, statusId);
      console.log("API RESULT:", data);
      console.log('data:', data);
      console.log('assigneeId:', assigneeId);
      console.log('status:', status);
      console.log('title:', title);
      setTasks(data ?? []);

    } catch (e) {
      console.error('Ошибка загрузки задач', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("FILTER EFFECT", {
      title,
      assigneeId,
      status,
    });
    const timeout = setTimeout(() => {
      const assignee = assigneeId ? Number(assigneeId) : undefined;
      const statusId = status ? Number(status) : undefined;
      loadTasks(title, assignee, statusId);
    }, 500);
    return () => clearTimeout(timeout);
  }, [title, assigneeId, status]);

  async function handleDelete(taskId: number) {
    if (!window.confirm("Удалить задачу?")) return;

    try {
      await deleteTask(taskId);

      setTasks(prev => prev.filter(t => t.taskId !== taskId));

    } catch (e) {
      console.error(e);
    }
  }

  if (loading) return <div>Загрузка...</div>;
  return (
    <div className="tasks-page">
      <div className="tasks-header">
        <h1>Все задачи</h1>

        <button className="create-btn" onClick={() => navigate(`/tasks/create`)}>
          Создать задачу
        </button>

      </div>

      <div className="tasks-filters">
        <input
          type="text"
          placeholder="Поиск по названию"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <select value={assigneeId} onChange={(e) => setAssigneeId(e.target.value)}>
          <option value="">Все исполнители</option>
          {users.map((user) => (
            <option key={user.UserId} value={user.UserId}>
              {user.FirstName} {user.LastName}
            </option>
          ))}
        </select>

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)} >
          <option value="">Все статусы</option>
          <option value="1">Новая</option>
          <option value="2">В работе</option>
          <option value="3">Выполнена</option>
        </select>
      </div>
      <table className="tasks-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Название</th>
            <th>Статус</th>
            <th>Исполнитель</th>
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
          ) : (
            tasks.map((task) => (
              <tr key={task.taskId}>
                <td>{task.taskId}</td>
                <td>{task.title}</td>
                <td>{task.status}</td>
                <td>{task.assigneeName}</td>
                <td>
                  {task.dueDate
                    ? new Date(task.dueDate).toLocaleDateString()
                    : "-"}
                </td>

                <td className="actions">
                  <button className="details-btn" onClick={() => navigate(`/tasks/${task.taskId}`)}>
                    Подробнее
                  </button>

                  <button className="edit-btn" onClick={() => navigate(`/tasks/${task.taskId}?edit=true`)}>
                    Изменить
                  </button>

                  <button className="delete-btn" onClick={() => handleDelete(task.taskId)}>
                    Удалить
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>)
  /*   return (
      <div className="tasks-page">
        <div className="tasks-header">
          <h1>Все задачи</h1>

          <Link to="/tasks/create" className="create-btn">
            + Создать задачу
          </Link>
        </div>

        <div className="tasks-filters">
          <input
            type="text"
            placeholder="Поиск по id"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="">Все статусы</option>
            <option value="1">Новая</option>
            <option value="2">В работе</option>
            <option value="3">Выполнена</option>
          </select>
        </div>

        <table className="tasks-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Название</th>
              <th>Описание</th>
              <th>Исполнитель</th>
              <th>Статус</th>
              <th>Действия</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>1</td>
              <td>Создать сайт</td>
              <td>Иванов</td>
              <td>В работе</td>
              <td>
                <button>Изменить</button>
                <button>Удалить</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      ); */
}