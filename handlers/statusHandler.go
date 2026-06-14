package handlers

import (
	"net/http"
	"taskmanager/repository"

	"github.com/gin-gonic/gin"
)

// GetStatuses godoc
// @Summary Получить список статусов
// @Description Возвращает все возможные статусы задач
// @Tags statuses
// @Produce json
// @Success 200 {array} models.StatusModel
// @Failure 500 {object} map[string]string
// @Router /statuses [get]
func GetStatuses(c *gin.Context) {

	statuses, err := repository.GetStatuses()

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Ошибка получения статусов",
		})
		return
	}

	c.JSON(http.StatusOK, statuses)
}
