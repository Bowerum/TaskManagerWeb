package response

import "time"

type TaskResponse struct {
	TaskId int

	Title       string
	Description string

	Status       string
	CreatorName  string
	AssigneeName string

	CreatedAt   time.Time
	DueDate     *time.Time
	CompletedAt *time.Time
}
