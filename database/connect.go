package database

import (
	"database/sql"
	"fmt"

	_ "github.com/denisenkom/go-mssqldb"
)

var DB *sql.DB

func Connect() {
	connectionString := "server=localhost;database=TaskManager;trusted_connection=true"
	//connectionString := "localhost;user id=sa;password=123456;port=1433;database=TaskManager"

	db, err := sql.Open("sqlserver", connectionString)
	if err != nil {
		panic(err)
	}

	err = db.Ping()
	if err != nil {
		panic("DB connection failed: " + err.Error())
	}

	fmt.Println("Database connected successfully")

	DB = db
}
