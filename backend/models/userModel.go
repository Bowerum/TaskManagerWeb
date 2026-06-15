package models

type UserModel struct {
	UserId int

	Login     string
	Email     string
	Password  string
	FirstName string
	LastName  string

	RoleId int
}
