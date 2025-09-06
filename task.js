const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "tasks.json");

const loadTasks = () => {
  if (!fs.existsSync(filePath)) return [];
  const data = fs.readFileSync(filePath, "utf8");
  return JSON.parse(data);
};

const saveTasks = (tasks) => {
  fs.writeFileSync(filePath, JSON.stringify(tasks, null, 2));
};

const args = process.argv.slice(2);
const command = args[0];

const addTask = (description) => {
  const tasks = loadTasks();
  const id = tasks.length ? tasks[tasks.length - 1].id + 1 : 1;
  const now = new Date().toISOString();

  const newTask = {
    id,
    description,
    status: "todo",
    createdAt: now,
    updatedAt: now,
  };

  tasks.push(newTask);
  saveTasks(tasks);
  console.log(`Task added successfully (ID: ${id})`);
};

if (command === "add") {
  const description = args[1];
  if (!description) {
    console.log("Please provide a description.");
  } else {
    addTask(description);
  }
}

function listTasks(status) {
  const tasks = loadTasks();
  let filtered = tasks;

  if (status) {
    filtered = tasks.filter((task) => task.status === status);
  }

  if (filtered.length === 0) {
    console.log("No tasks found.");
  } else {
    filtered.forEach((task) => {
      console.log(`[${task.id}] ${task.description} - ${task.status}`);
    });
  }
}

if (command === "list") {
  listTasks(args[1]);
}

function updateTask(id, newDesc) {
  const tasks = loadTasks();
  const task = tasks.find((t) => t.id == id);
  if (!task) return console.log("Task not found.");
  task.description = newDesc;
  task.updatedAt = new Date().toISOString();
  saveTasks(tasks);
  console.log("Task updated.");
}

function deleteTask(id) {
  let tasks = loadTasks();
  const lenBefore = tasks.length;
  tasks = tasks.filter((t) => t.id != id);
  if (tasks.length === lenBefore) return console.log("Task not found.");
  saveTasks(tasks);
  console.log("Task deleted.");
}

function markTask(id, status) {
  const tasks = loadTasks();
  const task = tasks.find((t) => t.id == id);
  if (!task) return console.log("Task not found.");
  task.status = status;
  task.updatedAt = new Date().toISOString();
  saveTasks(tasks);
  console.log(`Task marked as ${status}.`);
}

if (command === "update") updateTask(args[1], args[2]);
if (command === "delete") deleteTask(args[1]);
if (command === "mark-in-progress") markTask(args[1], "in-progress");
if (command === "mark-done") markTask(args[1], "done");
