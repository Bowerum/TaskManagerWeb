package handlers

import (
	"net/http"
	"strconv"
	"taskmanager/backend/models"
	"taskmanager/backend/repository"
	"taskmanager/backend/request"

	"github.com/gin-gonic/gin"
)

// GetTasks godoc
// @Summary Получить список задач
// @Description Возвращает все задачи с возможностью фильтрации по статусу и исполнителю
// @Tags tasks
// @Produce json
// @Param statusId query string false "ID статуса для фильтрации"
// @Param assigneeId query string false "ID исполнителя для фильтрации"
// @Success 200 {array} response.TaskResponse "Успешное получение списка задач"
// @Failure 500 {object} map[string]string "Ошибка сервера"
// @Router /tasks [get]
func GetTasks(c *gin.Context) {

	statusId := c.Query("statusId")
	assigneeId := c.Query("assigneeId")

	tasks, err := repository.GetTasksFiltered(statusId, assigneeId)

	if err != nil {
		c.JSON(500, gin.H{
			"error": "Ошибка получения задач",
		})
		return
	}

	c.JSON(200, tasks)
}

// GetTaskById godoc
// @Summary Получить задачу по ID
// @Description Возвращает задачу по указанному идентификатору
// @Tags tasks
// @Produce json
// @Param id path int true "ID задачи"
// @Success 200 {object} response.TaskResponse
// @Failure 400 {object} map[string]string
// @Failure 404 {object} map[string]string
// @Failure 500 {object} map[string]string
// @Router /tasks/{id} [get]
func GetTaskById(c *gin.Context) {

	id := c.Param("id")

	taskId, err := strconv.Atoi(id)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Некорректный id",
		})
		return
	}

	task, err := repository.GetTaskById(taskId)

	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"error": "Задача не найдена",
		})
		return
	}

	c.JSON(http.StatusOK, task)
}

// CreateTask godoc
// @Summary Создать новую задачу
// @Description Добавляет новую задачу в систему
// @Tags tasks
// @Accept json
// @Produce json
// @Param task body request.CreateTaskRequest true "Данные задачи"
// @Success 201 {object} response.TaskResponse
// @Failure 400 {object} map[string]string
// @Failure 500 {object} map[string]string
// @Router /tasks [post]
func CreateTask(c *gin.Context) {

	var req request.CreateTaskRequest

	if err := c.BindJSON(&req); err != nil {
		c.JSON(400, gin.H{"error": "bad request"})
		return
	}

	task, err := repository.CreateTask(req)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})
		return
	}

	c.JSON(http.StatusCreated, task)
}

// GetTaskForEdit godoc
// @Summary Получить задачу для редактирования
// @Description Возвращает задачу по ID для формы редактирования
// @Tags tasks
// @Produce json
// @Param id path int true "ID задачи"
// @Success 200 {object} models.TaskModel
// @Failure 400 {object} map[string]string
// @Failure 404 {object} map[string]string
// @Router /tasks/edit/{id} [get]
func GetTaskForEdit(c *gin.Context) {

	id := c.Param("id")

	taskId, err := strconv.Atoi(id)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Некорректный id",
		})
		return
	}

	task, err := repository.GetTaskModelById(taskId)

	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"error": "Задача не найдена",
		})
		return
	}

	c.JSON(http.StatusOK, task)
}

// UpdateTask godoc
// @Summary Обновить задачу
// @Description Обновляет существующую задачу по ID
// @Tags tasks
// @Accept json
// @Produce json
// @Param id path int true "ID задачи"
// @Param task body models.TaskModel true "Обновленные данные задачи"
// @Success 200 {object} models.TaskModel
// @Failure 400 {object} map[string]string
// @Failure 500 {object} map[string]string
// @Router /tasks/{id} [put]
func UpdateTask(c *gin.Context) {

	id := c.Param("id")

	taskId, err := strconv.Atoi(id)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Некорректный id",
		})
		return
	}

	var task models.TaskModel

	if err := c.BindJSON(&task); err != nil {
		c.JSON(400, gin.H{"error": "bad json"})
		return
	}
	err = repository.UpdateTask(taskId, task)

	if err != nil {
		c.JSON(500, gin.H{"error": "update failed"})
		return
	}
	updatedTask, err := repository.GetTaskById(taskId)

	if err != nil {
		c.JSON(500, gin.H{"error": "failed to load updated task"})
		return
	}
	c.JSON(200, updatedTask)

}

// DeleteTask godoc
// @Summary Удалить задачу
// @Description Удаляет задачу по ID
// @Tags tasks
// @Produce json
// @Param id path int true "ID задачи"
// @Success 200 {object} map[string]string
// @Failure 400 {object} map[string]string
// @Failure 500 {object} map[string]string
// @Router /tasks/{id} [delete]
func DeleteTask(c *gin.Context) {
	id := c.Param("id")

	taskId, err := strconv.Atoi(id)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Некорректный id",
		})
		return
	}

	err = repository.DeleteTask(taskId)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Ошибка удаления",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Задача удалена",
	})
}
