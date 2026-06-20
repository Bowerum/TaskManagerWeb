import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getUsers } from "../api/userApi";
import { createTask } from "../api/taskApi";

import { useAuthStore } from "../store/authStore";

import "../css/TaskDetails.css";

export default function CreateTask() {

    const user = useAuthStore((state) => state.user);

    const navigate = useNavigate();

    const [users, setUsers] = useState<any[]>([]);

    const [form, setForm] = useState({
        title: "",
        description: "",
        statusId: 1,
        assigneeId: 0,
        dueDate: "",
    });

    useEffect(() => {
        loadUsers();
    }, []);

    async function loadUsers() {
        try {
            const usersData = await getUsers();

            setUsers(usersData);

            if (usersData.length > 0) {
                setForm((prev) => ({
                    ...prev,
                    assigneeId: usersData[0].UserId,
                }));
            }
        } catch (e) {
            console.error(e);
        }
    }

    async function handleCreate() {
        try {
            console.log('user:', user);
            if (user != null) {
                const payload = {
                    title: form.title,
                    description: form.description,
                    creatorId: user.userId,
                    assigneeId: Number(form.assigneeId),
                    dueDate: form.dueDate
                        ? new Date(form.dueDate).toISOString()
                        : null,
                };
                console.log(payload)
                await createTask(payload);

                navigate("/tasks");
            }
        } catch (e) {
            console.error(e);
        }
    }

    function toDateTimeLocal(dateString: string) {
        const date = new Date(dateString);

        const offset = date.getTimezoneOffset();

        const localDate = new Date(date.getTime() - offset * 60000);

        return localDate.toISOString().slice(0, 16);
    }
    return (
        <div className="task-details-container">
            <div className="task-card">

                <h1 className="task-title">
                    Создание задачи
                </h1>

                <div className="task-grid">

                    <div className="task-field">
                        <span className="label">Название</span>

                        <input
                            value={form.title}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    title: e.target.value,
                                })
                            }
                        />
                    </div>

                    <div className="task-field">
                        <span className="label">Описание</span>

                        <textarea
                            value={form.description}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    description: e.target.value,
                                })
                            }
                        />
                    </div>

                    <div className="task-field">
                        <span className="label">Исполнитель</span>

                        <select
                            value={form.assigneeId}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    assigneeId: Number(e.target.value),
                                })
                            }>
                            {users.map((u) => (
                                <option
                                    key={u.UserId}
                                    value={u.UserId} >
                                    {u.FirstName} {u.LastName}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="task-field">
                        <span className="label">Дедлайн</span>

                        <input
                            type="datetime-local"
                            value={form.dueDate}
                            onChange={(e) =>
                                setForm({ ...form, dueDate: e.target.value })
                            } />
                    </div>

                </div>

                <div className="task-actions">

                    <button
                        className="btn save"
                        onClick={handleCreate}>
                        Создать
                    </button>

                    <button
                        className="btn cancel"
                        onClick={() => navigate("/tasks")}   >
                        Отмена
                    </button>

                </div>

            </div>
        </div>
    );
}

function toDateTimeLocal(dueDate: string) {
    throw new Error("Function not implemented.");
}
