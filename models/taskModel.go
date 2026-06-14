package models

import "time"

type TaskModel struct {
	TaskId int

	Title       string
	Description string

	StatusId   int
	CreatorId  int
	AssigneeId int

	CreatedAt   time.Time
	DueDate     *time.Time
	CompletedAt *time.Time
}
