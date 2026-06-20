package models

import "time"

type TaskModel struct {
	TaskId int `json:"taskId"`

	Title       string `json:"title"`
	Description string `json:"description"`

	StatusId   int `json:"statusId"`
	CreatorId  int `json:"creatorId"`
	AssigneeId int `json:"assigneeId"`

	CreatedAt   time.Time  `json:"createdAt"`
	DueDate     *time.Time `json:"dueDate"`
	CompletedAt *time.Time `json:"completedAt"`
}
