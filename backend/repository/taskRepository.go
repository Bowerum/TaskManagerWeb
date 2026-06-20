package repository

import (
	"database/sql"
	"fmt"
	"strings"
	"taskmanager/backend/database"
	"taskmanager/backend/models"
	"taskmanager/backend/request"
	"taskmanager/backend/response"
	"time"
)

func GetTasksFiltered(title, statusId, assigneeId string) ([]response.TaskResponse, error) {

	query := taskSelectQuery

	var conditions []string
	var args []any
	i := 1
	fmt.Println("TITLE:", title)
	if statusId != "" {
		conditions = append(conditions, fmt.Sprintf("t.StatusId = @p%d", i))
		args = append(args, statusId)
		i++
	}

	if assigneeId != "" {
		conditions = append(conditions, fmt.Sprintf("t.AssigneeId = @p%d", i))
		args = append(args, assigneeId)
		i++
	}
	if title != "" {
		conditions = append(
			conditions,
			fmt.Sprintf("t.Title LIKE @p%d", i),
		)
		args = append(args, "%"+title+"%")
		i++
	}
	fmt.Println("QUERY:", query)
	fmt.Println("ARGS:", args)

	if len(conditions) > 0 {
		query += " WHERE " + strings.Join(conditions, " AND ")
	}
	fmt.Println("QUERY:", query)
	fmt.Println("ARGS:", args)
	rows, err := database.DB.Query(query, args...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	return scanTasks(rows)
}
func GetTasks() ([]response.TaskResponse, error) {

	rows, err := database.DB.Query(taskSelectQuery)

	if err != nil {
		return nil, err
	}

	defer rows.Close()

	return scanTasks(rows)
}
func GetTaskModelById(id int) (models.TaskModel, error) {
	var task models.TaskModel

	row := database.DB.QueryRow(`
    SELECT
        TaskId,
        Title,
        Description,
        StatusId,
        AssigneeId,
        CreatedAt,
        DueDate,
        CompletedAt
    FROM Tasks
    WHERE TaskId = @p1
`, id)

	task, err := scanTaskModel(row)

	if err != nil {
		return task, err
	}
	fmt.Print(task)
	return task, nil
}
func GetTaskById(id int) (response.TaskResponse, error) {

	var task response.TaskResponse

	row := database.DB.QueryRow(taskSelectQuery+
		`WHERE t.TaskId = @p1`, id)

	task, err := scanTask(row)

	if err != nil {
		return task, err
	}

	return task, nil
}
func CreateTask(req request.CreateTaskRequest) (response.TaskResponse, error) {

	var taskId int
	fmt.Print(req)
	err := database.DB.QueryRow(`
		INSERT INTO Tasks (Title, Description, CreatorId, AssigneeId, StatusId, CreatedAt, DueDate)
		OUTPUT INSERTED.TaskId
		VALUES (@p1, @p2, @p3, @p4, 1, GETDATE(), @p5)
	`, req.Title,
		req.Description,
		req.CreatorId,
		req.AssigneeId,
		req.DueDate,
	).Scan(&taskId)

	if err != nil {
		return response.TaskResponse{}, err
	}

	row := database.DB.QueryRow(taskSelectQuery+`
		WHERE t.TaskId = @p1
	`, taskId)

	return scanTask(row)
}
func UpdateTask(id int, task models.TaskModel) error {

	if task.StatusId == 3 {
		now := time.Now()
		task.CompletedAt = &now
	} else {
		task.CompletedAt = nil
	}
	fmt.Println(task)
	fmt.Println(id)
	_, err := database.DB.Exec(`
        UPDATE Tasks
        SET
            Title = @p1,
            Description = @p2,
            StatusId = @p3,
            AssigneeId = @p4,
            DueDate = @p5,
            CompletedAt = @p6
        WHERE TaskId = @p7
    `,
		task.Title,
		task.Description,
		task.StatusId,
		task.AssigneeId,
		task.DueDate,
		task.CompletedAt,
		id,
	)

	return err
}
func DeleteTask(id int) error {

	result, err := database.DB.Exec(`
		DELETE FROM Tasks
		WHERE TaskId = @p1
	`, id)

	if err != nil {
		return err
	}

	rowsAffected, err := result.RowsAffected()

	if err != nil {
		return err
	}

	if rowsAffected == 0 {
		return sql.ErrNoRows
	}

	return nil
}
func GetTasksByAssignee(userId int) ([]response.TaskResponse, error) {
	rows, err := database.DB.Query(taskSelectQuery+
		` WHERE AssigneeId = @p1`, userId)

	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var tasks []response.TaskResponse

	for rows.Next() {
		var t response.TaskResponse

		err := rows.Scan(
			&t.TaskId,
			&t.Title,
			&t.Description,
			&t.Status,
			&t.CreatorName,
			&t.AssigneeName,
			&t.CreatedAt,
			&t.DueDate,
			&t.CompletedAt,
		)

		if err != nil {
			return nil, err
		}

		tasks = append(tasks, t)
	}

	return tasks, nil
}
