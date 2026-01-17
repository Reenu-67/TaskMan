const taskInput = document.getElementById("taskInput");
const dateInput = document.getElementById("dateInput");
const priorityInput = document.getElementById("priorityInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");

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

function renderTasks() {
  taskList.innerHTML = "";

  let filteredTasks = tasks;

  if (currentFilter === "pending") {
    filteredTasks = tasks.filter(task => !task.completed);
  } else if (currentFilter === "completed") {
    filteredTasks = tasks.filter(task => task.completed);
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