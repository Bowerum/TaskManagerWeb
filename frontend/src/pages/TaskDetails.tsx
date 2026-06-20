import { useEffect, useState } from "react";
import { useSearchParams, useParams, useNavigate } from "react-router-dom";
import { deleteTask, getTaskById, getTaskModelById } from "../api/taskApi";
import type { UpdateTaskRequest, TaskResponse } from "../types/task";
import "../css/taskDetails.css";
import { getUsers, UserResponse } from "../api/userApi";
import { updateTask } from "../api/taskApi";

export default function TaskDetails() {

  const { id } = useParams();
  const [searchParams] = useSearchParams();

  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);

  const [taskModel, setTaskModel] = useState<UpdateTaskRequest | null>(null);
  const [task, setTask] = useState<TaskResponse | null>(null);
  const [users, setUsers] = useState<UserResponse[]>([]);

  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    statusId: 0,
    assigneeId: 0,
    dueDate: "",
  });

  useEffect(() => {
    if (!id) return;
    loadData();
  }, [id]);

  useEffect(() => {
    console.log(searchParams.get("edit"))
    const isEdit = searchParams.get("edit") === "true";
    setEditMode(isEdit);
  }, [searchParams]);

  async function loadData() {
    try {
      setLoading(true);

      const [taskData, taskModelData, usersData] = await Promise.all([
        getTaskById(Number(id)),
        getTaskModelById(Number(id)),
        getUsers(),
      ]);

      setTask(taskData);
      setTaskModel(taskModelData);
      setUsers(usersData);

      console.log("task data:", taskData)
      console.log("task Modeldata:", taskModelData)

      setForm({
        title: taskModelData.title,
        description: taskModelData.description,
        statusId: taskModelData.statusId,
        assigneeId: taskModelData.assigneeId,
        dueDate: taskModelData.dueDate
          ? toDateTimeLocal(taskModelData.dueDate)
          : "",
      });
    } catch (e) {
      console.error("Ошибка загрузки", e);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <div>Загрузка...</div>;
  if (!task) return <div>Задача не найдена</div>;

  async function handleSave() {
    console.log("FORM BEFORE SAVE:", form);
    if (!task) return;
    try {
      console.log(form.assigneeId);
      const payload: UpdateTaskRequest = {
        title: form.title,
        description: form.description,

        statusId: Number(form.statusId),
        assigneeId: Number(form.assigneeId),

        dueDate: form.dueDate
          ? new Date(form.dueDate).toISOString()
          : null
      };
      const updatedTask = await updateTask(task.taskId, payload);

      setTask(updatedTask);
      setEditMode(false);

    } catch (e) {
      console.error(e);
    }

  }

  function formatDate(date: string | null) {
    if (!date) return "—";

    return new Date(date).toLocaleString("ru-RU", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  }
  function toDateTimeLocal(dateString: string) {
    const date = new Date(dateString);

    const offset = date.getTimezoneOffset();

    const localDate = new Date(date.getTime() - offset * 60000);

    return localDate.toISOString().slice(0, 16);
  }

  async function handleDelete() {
    if (!task) return;
    if (!window.confirm("Удалить задачу?")) return;
    try {
      await deleteTask(task.taskId);
      navigate("/tasks");
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <div className="task-details-container">
      <div className="task-card">

        <h1 className="task-title">
          #{task.taskId} —{" "}
          {!editMode ? (
            task.title
          ) : (
            <input
              value={form.title}
              onChange={(e) =>
                setForm({ ...form, title: e.target.value })
              }
            />
          )}
        </h1>

        <div className="task-grid">

          <div className="task-field">
            <span className="label">Описание</span>

            {!editMode ? (
              <span className="value">{task.description}</span>
            ) : (
              <textarea
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />
            )}
          </div>

          <div className="task-field">
            <span className="label">Статус</span>

            {!editMode ? (
              <span className="value status">
                {task.status}
              </span>
            ) : (
              <select
                value={form.statusId}
                onChange={(e) =>
                  setForm({
                    ...form,
                    statusId: Number(e.target.value),
                  })
                }
              >
                <option value="1">Новая</option>
                <option value="2">В работе</option>
                <option value="3">Выполнена</option>
              </select>
            )}
          </div>

          <div className="task-field">
            <span className="label">Исполнитель</span>

            {!editMode ? (
              <span className="value">{task.assigneeName}</span>
            ) : (
              <select
                value={form.assigneeId}
                onChange={(e) =>
                  setForm({
                    ...form,
                    assigneeId: Number(e.target.value),
                  })
                }
              >
                {users.map((u) => (
                  <option key={u.UserId} value={u.UserId}>
                    {u.FirstName} {u.LastName}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className="task-field">
            <span className="label">Создатель</span>
            <span className="value">{task.creatorName}</span>
          </div>

          <div className="task-field">
            <span className="label">Создана</span>
            <span className="value">
              {task.createdAt
                ? formatDate(task.createdAt).toLocaleString()
                : "—"}
            </span>
          </div>

          <div className="task-field">
            <span className="label">Дедлайн</span>

            {!editMode ? (
              <span className="value">
                {task.dueDate
                  ? formatDate(task.dueDate).toLocaleString()
                  : "—"}
              </span>
            ) : (
              <input
                type="datetime-local"
                value={form.dueDate}
                onChange={(e) =>
                  setForm({ ...form, dueDate: e.target.value })
                }
              />
            )}
          </div>

          <div className="task-field">
            <span className="label">Завершена</span>
            <span className="value">
              {task.completedAt
                ? formatDate(task.completedAt).toLocaleString()
                : "—"}
            </span>
          </div>

        </div>

        <div className="task-actions">

          {!editMode ? (
            <button onClick={() => setEditMode(true)}>
              Редактировать
            </button>
          ) : (
            <>
              <button onClick={handleSave}>
                Сохранить
              </button>

              <button
                onClick={() => {
                  setEditMode(false);
                }}
              >
                Отмена
              </button>
            </>
          )}

          <button className="btn delete" onClick={handleDelete}>
            Удалить
          </button>

        </div>

      </div>
    </div>
    /*  <div className="task-details-container">
       <div className="task-card">
 
         <h1 className="task-title">
           #{task.taskId} — {task.title}
         </h1>
 
         <div className="task-grid">
 
           <div className="task-field">
             <span className="label">Описание</span>
             <span className="value">{task.description}</span>
           </div>
 
 
           <div className="task-field">
             <span className="label">Статус</span>
             <select 
               value={form.status}
               onChange={(e) =>
                 setForm({ ...form, status: e.target.value })} >
               <option value="1">Новая</option>
               <option value="2">В работе</option>
               <option value="3">Выполнена</option>
             </select>
 
           </div>
 
 
           <div className="task-field">
             <span className="label">Исполнитель</span>
             <select
               value={form.assigneeId}
               onChange={(e) =>
                 setForm({ ...form, assigneeId: e.target.value })
               }>
               {users.map((u) => (
                 <option key={u.UserId} value={u.UserId}>
                   {u.FirstName} {u.LastName}
                 </option>
               ))}
             </select>
           </div>
 
           <div className="task-field">
             <span className="label">Создатель</span>
             <span className="value">{task.creatorName}</span>
           </div>
 
           <div className="task-field">
             <span className="label">Создана</span>
             <span className="value">
               {task.createdAt
                 ? new Date(task.createdAt).toLocaleString()
                 : "—"}
             </span>
           </div>
 
           <div className="task-field">
             <label>Дедлайн</label>
             <input
               type="date"
               value={form.dueDate}
               onChange={(e) =>
                 setForm({ ...form, dueDate: e.target.value })
               }
             />
           </div>
 
           <div className="task-field">
             <span className="label">Завершена</span>
             <span className="value">
               {task.completedAt
                 ? new Date(task.completedAt).toLocaleString()
                 : "—"}
             </span>
           </div>
 
         </div>
 
         <div className="task-actions">
           {!editMode ? (
             <button onClick={() => setEditMode(true)}>
               Редактировать
             </button>
           ) : (
             <>
               <button onClick={handleSave}>Сохранить</button>
               <button onClick={() => setEditMode(false)}>Отмена</button>
             </>
           )}
           <button className="btn delete">Удалить</button>
         </div>
 
       </div>
     </div> */
  );
}
