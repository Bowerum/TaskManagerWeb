import { CreateTaskRequest, UpdateTaskRequest } from "../types/task";

export async function getTasks(title?: string, assigneeId?: number, statusId?: number,) {
  const params = new URLSearchParams();

  if (title) params.append("title", title);
  if (statusId) params.append("statusId", String(statusId));
  if (assigneeId) params.append("assigneeId", String(assigneeId));

  const response = await fetch(
    `http://localhost:8080/tasks?${params.toString()}`
  );

  return response.json();
}

export async function getTaskById(id: number) {
  const response = await fetch(
    `http://localhost:8080/tasks/${id}`
  );

  if (!response.ok) {
    throw new Error("Task not found");
  }

  return response.json();
}

export async function getTaskModelById(id: number) {
  const response = await fetch(
    `http://localhost:8080/tasks/edit/${id}`
  );

  if (!response.ok) {
    throw new Error("Task not found");
  }

  return response.json();
}

export async function updateTask(id: number,task: UpdateTaskRequest) {
  const res = await fetch(`http://localhost:8080/tasks/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(task),
  
  });

  if (!res.ok) {
    throw new Error("Failed to update task");
  }

  return res.json();
}

export async function createTask(task: CreateTaskRequest) {
  const response = await fetch("http://localhost:8080/tasks", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(task),
  });

  if (!response.ok) {
    throw new Error("Failed to create task");
  }

  return response.json();
}

export async function deleteTask(id: number) {
  const response = await fetch(`http://localhost:8080/tasks/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete task");
  }

  return response.json();
}
export async function getMyTasks(userId: number) {
  const res = await fetch("http://localhost:8080/tasks/my-tasks", {
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Failed to load my tasks");
  }

  return res.json();
}