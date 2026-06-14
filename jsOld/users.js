async function loadUsers() {

    const response = await fetch("/users");
    const users = await response.json();
    const createSelect = document.getElementById("createAssigneeId");
    const editSelect = document.getElementById("editAssigneeId");
    const filterSelect = document.getElementById("assigneeFilter");

    users.forEach(user => {

        const option1 = document.createElement("option");

        option1.value = user.UserId;
        option1.textContent =
            `${user.FirstName} ${user.LastName}`;

        createSelect.appendChild(option1);

        const option2 = document.createElement("option");
        option2.value = user.UserId;
        option2.textContent = `${user.FirstName} ${user.LastName}`;

        editSelect.appendChild(option2);

        const filterSelect = document.getElementById("assigneeFilter");

        const option3 = document.createElement("option");
        option3.value = user.UserId;
        option3.textContent =
            `${user.FirstName} ${user.LastName}`;

        filterSelect.appendChild(option3);
    });
}