export interface TaskResponse {
  taskId: number;

  title: string;
  description: string;

  status: string;

  creatorName: string;
  assigneeName: string;

  createdAt: string;
  dueDate: string | null;
  completedAt: string | null;
}
export interface UpdateTaskRequest {
  title: string;
  description: string;

  statusId: number;
  assigneeId: number;

  dueDate: string | null;
}
export interface CreateTaskRequest {
  title: string;
  description: string;

  creatorId: number;
  assigneeId: number;

  dueDate: string | null;
}