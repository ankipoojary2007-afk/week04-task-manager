
const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");
const emptyState = document.getElementById("emptyState");
const pendingCount = document.getElementById("pendingCount");
const totalCount = document.getElementById("totalCount");
const filterButtons = document.querySelectorAll(".filter-btn");

let tasks = [];
let currentFilter = "all";

// Load saved tasks from localStorage
try {
    const savedTasks = localStorage.getItem("week04Tasks");
    tasks = savedTasks ? JSON.parse(savedTasks) : [];

    if (!Array.isArray(tasks)) {
        tasks = [];
    }
} catch (error) {
    tasks = [];
}

// Save tasks in the browser
function saveTasks() {
    localStorage.setItem("week04Tasks", JSON.stringify(tasks));
}

// Add a new task
taskForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const taskText = taskInput.value.trim();

    // Prevent empty tasks
    if (taskText === "") {
        taskInput.focus();
        return;
    }

    const newTask = {
        id: Date.now().toString() + Math.random().toString(16).slice(2),
        text: taskText,
        completed: false
    };

    tasks.unshift(newTask);

    saveTasks();
    renderTasks();

    taskInput.value = "";
    taskInput.focus();
});

// Display tasks according to the selected filter
function renderTasks() {
    taskList.replaceChildren();

    const filteredTasks = tasks.filter(function (task) {
        if (currentFilter === "completed") {
            return task.completed;
        }

        if (currentFilter === "pending") {
            return !task.completed;
        }

        return true;
    });

    // Update task counters
    const pendingTasks = tasks.filter(function (task) {
        return !task.completed;
    });

    pendingCount.textContent = pendingTasks.length;
    totalCount.textContent = tasks.length;

    // Show a message when the list is empty
    if (filteredTasks.length === 0) {
        emptyState.hidden = false;

        if (tasks.length === 0) {
            emptyState.textContent =
                "No tasks yet. Add your first task above!";
        } else if (currentFilter === "completed") {
            emptyState.textContent = "No completed tasks yet.";
        } else if (currentFilter === "pending") {
            emptyState.textContent = "You're all caught up! No pending tasks.";
        } else {
            emptyState.textContent = "No tasks to display.";
        }
    } else {
        emptyState.hidden = true;
    }

    // Create and display each task
    filteredTasks.forEach(function (task) {
        const listItem = document.createElement("li");
        listItem.classList.add("task-item");

        if (task.completed) {
            listItem.classList.add("completed");
        }

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.classList.add("complete-checkbox");
        checkbox.checked = task.completed;
        checkbox.setAttribute(
            "aria-label",
            "Mark " + task.text + " as completed"
        );

        // Mark a task as completed or pending
        checkbox.addEventListener("change", function () {
            task.completed = checkbox.checked;
            saveTasks();
            renderTasks();
        });

        const taskText = document.createElement("span");
        taskText.classList.add("task-text");
        taskText.textContent = task.text;

        const deleteButton = document.createElement("button");
        deleteButton.type = "button";
        deleteButton.classList.add("delete-btn");
        deleteButton.textContent = "×";
        deleteButton.setAttribute("aria-label", "Delete " + task.text);
        deleteButton.title = "Delete task";

        // Delete a task
        deleteButton.addEventListener("click", function () {
            tasks = tasks.filter(function (item) {
                return item.id !== task.id;
            });

            saveTasks();
            renderTasks();
        });

        listItem.append(checkbox, taskText, deleteButton);
        taskList.appendChild(listItem);
    });
}

// Filter tasks: All, Pending, or Completed
filterButtons.forEach(function (button) {
    button.addEventListener("click", function () {
        currentFilter = button.dataset.filter;

        filterButtons.forEach(function (filterButton) {
            const isActive = filterButton === button;
            filterButton.classList.toggle("active", isActive);
            filterButton.setAttribute("aria-pressed", isActive);
        });

        renderTasks();
    });
});

// Show saved tasks when the page opens
renderTasks();
