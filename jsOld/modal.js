let modalMode = "create";

function openCreateModal() {

    modalMode = "create";
    selectedTaskId = null;

    document.getElementById("createForm").style.display = "flex";
    document.getElementById("editForm").style.display = "none";

    clearCreateForm();

    document.getElementById("modal").classList.remove("hidden");
}
async function openEditModal() {

    if (!selectedTaskId) {
        alert("Выберите задачу");
        return;
    }
    const response = await fetch(`/tasks/edit/${selectedTaskId}`);

    if (!response.ok) {
        alert("Не удалось загрузить задачу");
        return;
    }

    const task = await response.json();

    modalMode = "edit";

    document.getElementById("editTitle").value = task.Title;
    document.getElementById("editDescription").value = task.Description;

    document.getElementById("editStatusId").value = task.StatusId.toString();
    document.getElementById("editAssigneeId").value = task.AssigneeId.toString();

    document.getElementById("editDueDate").value =
        toDateTimeLocal(task.DueDate);
    editCreatedAt = task.CreatedAt;
    document.getElementById("createForm").style.display = "none";
    document.getElementById("editForm").style.display = "flex";

    document.getElementById("modal").classList.remove("hidden");
}

function openModal(mode = "create") {

    modalMode = mode;

    document.getElementById("modal").classList.remove("hidden");
}

function clearCreateForm() {
    document.getElementById("title").value = "";
    document.getElementById("description").value = "";
    document.getElementById("createAssigneeId").value = "";
}
function closeModal() {
    document.querySelectorAll("tr").forEach(r => {
        r.classList.remove("selected-row");
    });
    document.getElementById("modal").classList.add("hidden");
}