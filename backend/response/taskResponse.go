package response

import "time"

type TaskResponse struct {
	TaskId int `json:"taskId"`

	Title       string `json:"title"`
	Description string `json:"description"`

	Status string `json:"status"`

	CreatorName  string `json:"creatorName"`
	AssigneeName string `json:"assigneeName"`

	CreatedAt   time.Time  `json:"createdAt"`
	DueDate     *time.Time `json:"dueDate"`
	CompletedAt *time.Time `json:"completedAt"`
}
