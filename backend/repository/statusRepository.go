package repository

import (
	"taskmanager/backend/database"
	"taskmanager/backend/models"
)

func GetStatuses() ([]models.StatusModel, error) {

	rows, err := database.DB.Query(`
		SELECT StatusId, Name
		FROM Statuses
		ORDER BY StatusId
	`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var statuses []models.StatusModel

	for rows.Next() {

		var status models.StatusModel

		err := rows.Scan(
			&status.StatusId,
			&status.Name,
		)

		if err != nil {
			return nil, err
		}

		statuses = append(statuses, status)
	}

	return statuses, nil
}
