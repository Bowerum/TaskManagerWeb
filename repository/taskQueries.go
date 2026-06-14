package repository

const taskSelectQuery = `
	SELECT
		t.TaskId,
		t.Title,
		t.Description,
		s.Name AS Status,

		u1.FirstName + ' ' + u1.LastName AS CreatorName,
		u2.FirstName + ' ' + u2.LastName AS AssigneeName,

		t.CreatedAt,
		t.DueDate,
		t.CompletedAt
	FROM Tasks t
	JOIN Statuses s ON t.StatusId = s.StatusId
	JOIN Users u1 ON t.CreatorId = u1.UserId
	JOIN Users u2 ON t.AssigneeId = u2.UserId
`
