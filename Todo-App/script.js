const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const emptyMsg = document.getElementById("emptyMsg");
const themeBtn = document.getElementById("themeBtn");

const totalTasks = document.getElementById("totalTasks");
const pendingTasks = document.getElementById("pendingTasks");
const completedTasks = document.getElementById("completedTasks");
const progressPercent = document.getElementById("progressPercent");
const progressFill = document.getElementById("progressFill");
const clearCompletedBtn = document.getElementById("clearCompleted");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function updateStats() {
  const total = tasks.length;
  const completed = tasks.filter(task => task.completed).length;
  const pending = total - completed;
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100);

  totalTasks.textContent = total;
  pendingTasks.textContent = pending;
  completedTasks.textContent = completed;
  progressPercent.textContent = percent + "%";
  progressFill.style.width = percent + "%";
}

function renderTasks() {
  taskList.innerHTML = "";

  const filteredTasks = tasks.filter(task => {
    if (currentFilter === "pending") return !task.completed;
    if (currentFilter === "completed") return task.completed;
    return true;
  });

  emptyMsg.style.display = filteredTasks.length === 0 ? "block" : "none";

  filteredTasks.forEach(task => {
    const index = tasks.indexOf(task);

    const li = document.createElement("li");

    li.innerHTML = `
      <span class="task-text ${task.completed ? "completed" : ""}">
        ${task.text}
      </span>
      <div>
        <button class="action-btn done-btn" onclick="toggleTask(${index})">✓</button>
        <button class="action-btn edit-btn" onclick="editTask(${index})">✎</button>
        <button class="action-btn delete-btn" onclick="deleteTask(${index})">🗑</button>
      </div>
    `;

    taskList.appendChild(li);
  });

  updateStats();
}

function addTask() {
  const text = taskInput.value.trim();

  if (text === "") {
    alert("Please enter a task!");
    return;
  }

  tasks.push({ text, completed: false });
  taskInput.value = "";
  saveTasks();
  renderTasks();
}

function toggleTask(index) {
  tasks[index].completed = !tasks[index].completed;
  saveTasks();
  renderTasks();
}

function editTask(index) {
  const updated = prompt("Edit your task:", tasks[index].text);

  if (updated !== null && updated.trim() !== "") {
    tasks[index].text = updated.trim();
    saveTasks();
    renderTasks();
  }
}

function deleteTask(index) {
  tasks.splice(index, 1);
  saveTasks();
  renderTasks();
}

addBtn.addEventListener("click", addTask);

taskInput.addEventListener("keypress", function(e) {
  if (e.key === "Enter") addTask();
});

document.querySelectorAll(".filter").forEach(button => {
  button.addEventListener("click", function() {
    document.querySelectorAll(".filter").forEach(btn => btn.classList.remove("active"));
    this.classList.add("active");
    currentFilter = this.dataset.filter;
    renderTasks();
  });
});

clearCompletedBtn.addEventListener("click", function() {
  tasks = tasks.filter(task => !task.completed);
  saveTasks();
  renderTasks();
});

themeBtn.addEventListener("click", function() {
  document.body.classList.toggle("dark");
  themeBtn.textContent = document.body.classList.contains("dark") ? "☀️" : "🌙";
});

renderTasks();