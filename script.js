const taskInput = document.getElementById("taskInput");
const dateInput = document.getElementById("dateInput");
const priorityInput = document.getElementById("priorityInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");

let searchQuery = "";
const searchInput = document.getElementById("searchInput");

if (searchInput) {
  searchInput.addEventListener("input", () => {
    searchQuery = searchInput.value.toLowerCase();
    renderTasks();
  });
}

const themeToggle = document.getElementById("themeToggle");

// Load saved theme
if (localStorage.getItem("taskman_theme") === "dark") {
  document.body.classList.add("dark");
  themeToggle.textContent = "☀️";
}

// Toggle theme
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");

  if (document.body.classList.contains("dark")) {
    localStorage.setItem("taskman_theme", "dark");
    themeToggle.textContent = "☀️";
  } else {
    localStorage.setItem("taskman_theme", "light");
    themeToggle.textContent = "🌙";
  }
});

let tasks = JSON.parse(localStorage.getItem("taskman_tasks")) || [];
let currentFilter = "all";

document.addEventListener("DOMContentLoaded",renderTasks);

addTaskBtn.addEventListener("click",addTask);

function addTask(){
  const title = taskInput.value;
  const dueDate = dateInput.value;
  const priority = priorityInput.value;

  if (title ===""){
    alert("Please enter a task");
    return;
  }

  const task = {
    id: Date.now(),
    title,
    dueDate,
    priority,
    completed:false,
  };

  tasks.push(task);
  saveTasks();
  renderTasks();
  clearInputs();
}

function saveTasks() {
  localStorage.setItem("taskman_tasks",JSON.stringify(tasks));
}

function updateCounter() {
  const total = tasks.length;
  const completed = tasks.filter(task => task.completed).length;
  const pending = total - completed;

  document.getElementById("totalCount").textContent = `Total: ${total}`;
  document.getElementById("pendingCount").textContent = `Pending: ${pending}`;
  document.getElementById("completedCount").textContent = `Completed: ${completed}`;
}

function renderTasks() {
  taskList.innerHTML = "";
  updateCounter();

  let filteredTasks = tasks;

  //  Search filter
if (searchQuery.trim() !== "") {
  filteredTasks = filteredTasks.filter(task =>
    task.title.toLowerCase().includes(searchQuery)
  );
}

  if (currentFilter === "pending") {
    filteredTasks = filteredTasks.filter(task => !task.completed);
  } else if (currentFilter === "completed") {
    filteredTasks = filteredTasks.filter(task => task.completed);
  }

  if (filteredTasks.length === 0) {
    taskList.innerHTML = `<p class="empty">No tasks found</p>`;
    return;
  }

  filteredTasks.forEach(task =>{
    const taskCard = document.createElement("div");
    taskCard.className =`task-card ${task.priority}`;
    if (task.completed) taskCard.classList.add("completed");

    taskCard.innerHTML= `
    <input type = "checkbox" ${task.completed ? "checked" : ""}/>
    <div class= "task-details">
    <h3 class = "task-title">${task.title}</h3>
    <small>${task.dueDate ? "Due:"+ formatDate(task.dueDate) : ""}</small>
    </div>
    <span class= "priority">${task.priority}</span>
    <div class = "actions">
    <button data-id = "${task.id}" class= "delete-btn">🗑️</button>
    </div>
    `;

    taskCard.querySelector("input").addEventListener("change", () => {
      task.completed = !task.completed;
      saveTasks();
      renderTasks();
    });

    /* Delete Task */
    taskCard.querySelector(".delete-btn").addEventListener("click", () => {
      tasks = tasks.filter(t => t.id !== task.id);
      saveTasks();
      renderTasks();
    });

    taskList.appendChild(taskCard);
  });
}

document.getElementById("allBtn").addEventListener("click", () => {
  currentFilter = "all";
  renderTasks();
});

document.getElementById("pendingBtn").addEventListener("click", () => {
  currentFilter = "pending";
  renderTasks();
});

document.getElementById("completedBtn").addEventListener("click", () => {
  currentFilter = "completed";
  renderTasks();
});

function clearInputs(){
  taskInput.value = "";
  dateInput.value = "";
  priorityInput.value = "high";
}

function formatDate(dateStr){
  const options = { day: "2-digit",month:"short",year:"numeric"};
  return new Date(dateStr).toLocaleDateString("en-IN",options);
}

const quoteText = document.getElementById("quoteText");
const quoteAuthor = document.getElementById("quoteAuthor");

async function loadDailyQuote() {
  try {
    const res = await fetch("https://api.quotable.io/random");
    const data = await res.json();

    quoteText.textContent = `"${data.content}"`;
    quoteAuthor.textContent = `— ${data.author}`;
  } catch (error) {
    quoteText.textContent = "Stay focused. Stay consistent.";
    quoteAuthor.textContent = "";
  }
}

loadDailyQuote();