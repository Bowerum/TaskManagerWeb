package models

type UserModel struct {
	UserId int

	Username     string
	Email        string
	PasswordHash string
	FirstName    string
	LastName     string

	RoleId int
}
