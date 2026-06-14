package handlers

import (
	"taskmanager/repository"

	"github.com/gin-gonic/gin"
)

// GetUsers godoc
// @Summary Получить список пользователей
// @Description Возвращает всех пользователей системы
// @Tags users
// @Produce json
// @Success 200 {array} response.UserResponse
// @Failure 500 {object} map[string]string
// @Router /users [get]
func GetUsers(c *gin.Context) {

	users, err := repository.GetUsers()

	if err != nil {
		c.JSON(500, gin.H{
			"error": err.Error(),
		})
		return
	}

	c.JSON(200, users)
}
