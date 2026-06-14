let selectedTaskId = null;
let editCreatedAt = null;

function refreshTaskRow(task) {
    return `
         <tr data-id="${task.TaskId}" onclick="selectTask(this)">
            <td>${task.TaskId}</td>
            <td>${task.Title}</td>
            <td>${task.Description}</td>
            <td>${task.Status}</td>
            <td>${task.CreatorName}</td>
            <td>${task.AssigneeName}</td>
            <td>${formatDate(task.CreatedAt)}</td>
            <td>${formatDate(task.DueDate)}</td>
            <td>${formatDate(task.CompletedAt)}</td>
        </tr>
    `;
}

async function loadTasks() {

    const response = await fetch("http://localhost:8080/tasks");

    const tasks = await response.json();

    const table = document.getElementById("tasksTable");

    table.innerHTML = "";

    tasks.forEach(task => {

        table.innerHTML += refreshTaskRow(task);
    });
}
async function searchTask() {

    const id = document.getElementById("taskIdInput").value;

    if (!id) {
        alert("Введите ID задачи");
        return;
    }

    const response = await fetch(`/tasks/${id}`);

    if (!response.ok) {
        alert("Задача не найдена");
        return;
    }

    const task = await response.json();
    const table = document.getElementById("tasksTable");

    table.innerHTML = refreshTaskRow(task);
}

async function createTask() {

    const task = {
        Title: document.getElementById("title").value,
        Description: document.getElementById("description").value,
        CreatorId: 1,
        AssigneeId: Number(document.getElementById("createAssigneeId").value)
    };
    if (!validateTask(task, "create")) return;

    const response = await fetch("/tasks", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(task)
    });

    if (!response.ok) {
        alert("Ошибка создания задачи");
        return;
    }

     return await response.json();
}

async function updateTask() {

    const task = {
        Title: document.getElementById("editTitle").value,
        Description: document.getElementById("editDescription").value,
        StatusId: Number(document.getElementById("editStatusId").value),
        AssigneeId: Number(document.getElementById("editAssigneeId").value),
        DueDate: new Date(document.getElementById("editDueDate").value) || null,
    };

    if (!validateTask(task, "edit", editCreatedAt)) return;

    const response = await fetch(`/tasks/${selectedTaskId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(task)
    });
console.log(response);
    if (!response.ok) {
        alert("Ошибка обновления задачи");
        return;
    }
     return await response.json();
}

function selectTask(row) {

    document.querySelectorAll("tr").forEach(r => {
        r.classList.remove("selected-row");
    });

    row.classList.add("selected-row");

    selectedTaskId = row.dataset.id;
}

async function saveTask() {
    let result;

    if (modalMode === "create")
        result = await createTask();
    else result = await updateTask();

    if (!result) return;

    closeModal();
    await loadTasks();
}
function validateTask(task, mode, createdAt) {

    if (!task.Title) {
        alert("Введите название задачи");
        return false;
    }

    if (!task.AssigneeId) {
        alert("Выберите исполнителя");
        return false;
    }
    if (mode == "edit") {
        if (!task.StatusId) {
            alert("Выберите статус");
            return false;
        }
        if (task.DueDate && createdAt) {
            const created = new Date(createdAt);
            const due = new Date(task.DueDate);
            if (due < created) {
                alert("Дедлайн не может быть раньше даты создания");
                return false;
            }
        }
    }
    return true;
}
async function deleteTask() {

    if (!selectedTaskId) {
        alert("Выберите задачу");
        return;
    }

    if (!confirm("Удалить задачу?")) {
        return;
    }

    const response = await fetch(`/tasks/${selectedTaskId}`, {
        method: "DELETE"
    });

    if (!response.ok) {
        const err = await response.json();
        alert(err.error || "Ошибка удаления");
        return;
    }

    const row = document.querySelector(
        `tr[data-id="${selectedTaskId}"]`
    );

    if (row) {
        row.remove();
    }

    selectedTaskId = null;
}

async function applyFilters() {

    const statusId =
        document.getElementById("statusFilter").value;

    const assigneeId =
        document.getElementById("assigneeFilter").value;

    const params = new URLSearchParams();

    if (statusId) {
        params.append("statusId", statusId);
    }

    if (assigneeId) {
        params.append("assigneeId", assigneeId);
    }

    const response = await fetch(
        `/tasks?${params.toString()}`
    );
console.log("STATUS:", response.status);
    const tasks = await response.json();

console.log("DATA:", tasks);
     const table = document.getElementById("tasksTable");
    table.innerHTML = "";

    tasks.forEach(task => {
        table.innerHTML += refreshTaskRow(task);
    });
}
function clearFilters() {

    document.getElementById("statusFilter").value = "";
    document.getElementById("assigneeFilter").value = "";

    loadTasks();
}