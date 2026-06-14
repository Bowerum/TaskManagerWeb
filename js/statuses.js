async function loadStatuses() {

    const response = await fetch("/statuses");
    const statuses = await response.json();


    const filterSelect =
        document.getElementById("statusFilter");

    const editSelect =
        document.getElementById("editStatusId");

    statuses.forEach(status => {

        const option =
            document.createElement("option");

        option.value = status.StatusId;
        option.textContent = status.Name;

        filterSelect.appendChild(option);

         const option2 =
            document.createElement("option");

        option2.value = status.StatusId;
        option2.textContent = status.Name;

        editSelect.appendChild(option2);
    });
} 