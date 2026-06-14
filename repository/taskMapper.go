package repository

import (
	"database/sql"
	"taskmanager/models"
	"taskmanager/response"
)

func scanTask(row *sql.Row) (response.TaskResponse, error) {

	var task response.TaskResponse

	err := row.Scan(
		&task.TaskId,
		&task.Title,
		&task.Description,
		&task.Status,
		&task.CreatorName,
		&task.AssigneeName,
		&task.CreatedAt,
		&task.DueDate,
		&task.CompletedAt,
	)

	return task, err
}

func scanTaskModel(row *sql.Row) (models.TaskModel, error) {

	var task models.TaskModel

	err := row.Scan(
		&task.TaskId,
		&task.Title,
		&task.Description,
		&task.StatusId,
		&task.AssigneeId,
		&task.CreatedAt,
		&task.DueDate,
		&task.CompletedAt,
	)

	return task, err
}
func scanTasks(rows *sql.Rows) ([]response.TaskResponse, error) {

	var tasks []response.TaskResponse

	for rows.Next() {

		var task response.TaskResponse

		err := rows.Scan(
			&task.TaskId,
			&task.Title,
			&task.Description,
			&task.Status,
			&task.CreatorName,
			&task.AssigneeName,
			&task.CreatedAt,
			&task.DueDate,
			&task.CompletedAt,
		)

		if err != nil {
			return nil, err
		}

		tasks = append(tasks, task)
	}

	return tasks, nil
}
