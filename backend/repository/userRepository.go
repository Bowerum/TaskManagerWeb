package repository

import (
	"taskmanager/backend/database"
	"taskmanager/backend/models"
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
func GetUserByLogin(login string) (*models.UserModel, error) {

	row := database.DB.QueryRow(`
		SELECT UserId,
		       Login,
		       Email,
		       Password,
		       FirstName,
		       LastName,
		       RoleId
		FROM Users
		WHERE Login = @p1
	`, login)

	var user models.UserModel

	err := row.Scan(
		&user.UserId,
		&user.Login,
		&user.Email,
		&user.Password,
		&user.FirstName,
		&user.LastName,
		&user.RoleId,
	)

	if err != nil {
		return nil, err
	}

	return &user, nil
}
