package request

import "time"

type CreateTaskRequest struct {
	Title       string
	Description string
	CreatorId   int
	AssigneeId  int
	DueDate     *time.Time
}
