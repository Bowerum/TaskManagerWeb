package request

type CreateTaskRequest struct {
	Title       string
	Description string
	CreatorId   int
	AssigneeId  int
}
