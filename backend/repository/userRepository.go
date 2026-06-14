package repository

import (
	"taskmanager/backend/database"
	"taskmanager/backend/response"
)

func GetUsers() ([]response.UserResponse, error) {

	rows, err := database.DB.Query(`
        SELECT UserId,
               FirstName,
               LastName
        FROM Users
		WHERE RoleId = 2
    `)

	if err != nil {
		return nil, err
	}

	defer rows.Close()

	var users []response.UserResponse

	for rows.Next() {

		var user response.UserResponse

		err := rows.Scan(
			&user.UserId,
			&user.FirstName,
			&user.LastName,
		)

		if err != nil {
			return nil, err
		}

		users = append(users, user)
	}

	return users, nil
}
