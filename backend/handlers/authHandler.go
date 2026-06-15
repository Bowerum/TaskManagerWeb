package handlers

import (
	"net/http"
	"taskmanager/backend/repository"
	"taskmanager/backend/request"
	"taskmanager/backend/utils"

	"github.com/gin-gonic/gin"
)

func Login(c *gin.Context) {

	var req request.LoginRequest

	if err := c.BindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "bad request"})
		return
	}

	user, err := repository.GetUserByLogin(req.Login)

	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error": "Такого пользователя не найдено",
		})
		return
	}

	if user.Password != req.Password {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error": "Неверный пароль",
		})
		return
	}
	token, err := utils.GenerateToken(user.UserId, user.RoleId)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "token generation failed",
		})
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"token": token,
		"user": gin.H{
			"userId":    user.UserId,
			"firstName": user.FirstName,
			"lastName":  user.LastName,
			"roleId":    user.RoleId,
		},
	})
}
