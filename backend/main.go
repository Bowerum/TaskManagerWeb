// @title TaskManager API
// @version 1.0
// @description REST API для задач
// @host localhost:8080
// @BasePath /

package main

import (
	"fmt"
	"taskmanager/backend/database"
	_ "taskmanager/backend/docs"
	"taskmanager/backend/handlers"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	swaggerFiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"
)

func main() {
	router := gin.Default()

	database.Connect()

	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:5173"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	router.POST("/login", handlers.Login)

	router.GET("/tasks", handlers.GetTasks)
	router.GET("/tasks/edit/:id", handlers.GetTaskForEdit)
	router.GET("/tasks/:id", handlers.GetTaskById)

	router.GET("/users", handlers.GetUsers)

	router.GET("/statuses", handlers.GetStatuses)

	router.POST("/tasks", handlers.CreateTask)

	router.PUT("/tasks/:id", handlers.UpdateTask)

	router.DELETE("/tasks/:id", handlers.DeleteTask)

	router.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))

	fmt.Println("App started")

	router.Static("/js", "./js")
	router.Static("/css", "./css")

	router.GET("/", func(c *gin.Context) {
		c.HTML(200, "index.html", nil)
	})

	router.Run(":8080")
}
