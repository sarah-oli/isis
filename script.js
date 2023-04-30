// add task input
const newTaskInput = document.querySelector("#new-task-input");
// <ul> that receives <li>
const taskList = document.querySelector(".task-list");

// section .completed-tasks
const completedTasksContainer = document.querySelector(".completed-tasks");
// ul .completed-tasks__list
const completedTasks = document.querySelector(".completed-tasks__list");

// localStorage arrays
let tasksLocal = JSON.parse(localStorage.getItem("todos")) || [];
let completedTasksLocal =
  JSON.parse(localStorage.getItem("completedTodos")) || [];

// Modal related variables
const editModal = document.querySelector("#edit-modal");
const editInput = document.querySelector("#edit-input");
const editBtn = document.querySelector("#edit");
const deleteTaskBtn = document.querySelector("#delete-task");

const closeBtn = document.querySelector("#close");
closeBtn.addEventListener("click", () => {
  editModal.close();
});

document.addEventListener("contextmenu", (e) => {
  e.preventDefault();
});

// Marks the item as completed
function checkItem(checkbox, li, text) {
  text.classList.toggle("checked");
  let el;

  if (checkbox.checked) {
    // Appends the task to the .completed-tasks
    completedTasks.appendChild(li);
    el = tasksLocal.indexOf(text.textContent);
    tasksLocal.splice(el, 1);
    completedTasksLocal.push(text.textContent);

    localStorage.todos = JSON.stringify(tasksLocal);
    localStorage.completedTodos = JSON.stringify(completedTasksLocal);
  } else {
    // Appends the task to the task-list container
    taskList.appendChild(li);
    el = completedTasksLocal.indexOf(text.textContent);

    completedTasksLocal.splice(el, 1);
    tasksLocal.push(text.textContent);

    localStorage.completedTodos = JSON.stringify(completedTasksLocal);
    localStorage.todos = JSON.stringify(tasksLocal);
  }
}

// Adds a new task to taskList
function addNewTask() {
  if (newTaskInput.value == "") {
    alert("There's no text on the input!");
  } else {
    // li
    let newTaskLi = document.createElement("li");
    newTaskLi.classList.add("list-item");

    // span inside li
    let newTaskText = document.createElement("span");
    newTaskText.classList.add("item-text");

    let checkbox = document.createElement("INPUT");
    checkbox.setAttribute("type", "checkbox");
    checkbox.classList.add("item-checkbox");

    newTaskLi.appendChild(checkbox);
    newTaskLi.appendChild(newTaskText);
    // adds <li> in the <ul>
    taskList.appendChild(newTaskLi);

    // puts the input text into the <p>
    newTaskText.textContent = newTaskInput.value;
    tasksLocal.push(newTaskText.textContent);
    localStorage.setItem("todos", JSON.stringify(tasksLocal));

    // Editing on double click
    newTaskText.onclick = (e) => {
      editModal.showModal();

      // Stores the current value on the item
      let oldValue = e.target.textContent;
      // Stores the index of the current value
      let oldValueIndex = tasksLocal.indexOf(oldValue);

      function deleteTask() {
        newTaskLi.remove();
        let element;
        if (checkbox.checked) {
          // Removes it from completedTasks storage
          element = completedTasksLocal.indexOf(oldValue);
          completedTasksLocal.splice(element, 1);
          localStorage.completedTodos = JSON.stringify(completedTasksLocal);
        } else {
          // Removes it from todos storage
          element = tasksLocal.indexOf(oldValue);
          tasksLocal.splice(element, 1);
          localStorage.todos = JSON.stringify(tasksLocal);
        }
        editModal.close();
      }

      deleteTaskBtn.addEventListener("click", deleteTask);

      // Puts the current value inside of editInput
      editInput.textContent = oldValue;

      // Edits only the user actually wrote something
      function editItem() {
        let newValue = editInput.textContent;

        if (newValue != "") {
          e.target.textContent = newValue;
          tasksLocal.splice(oldValueIndex, 1, newValue);
          localStorage.setItem("todos", JSON.stringify(tasksLocal));
          editModal.close();
        }
      }

      // EventListener for the editBtn that is in the modal
      editBtn.addEventListener("click", editItem);
      editInput.addEventListener("keyup", (e) => {
        if (e.ctrlKey === true && e.key === "Enter") {
          editItem();
        }
      });
    };

    // Erases the text in the input
    newTaskInput.value = "";

    // Marks the item as checked
    checkbox.addEventListener("click", () => {
      checkItem(checkbox, newTaskLi, newTaskText);
    });
  }
}

// EventListener that monitors the input text, if enter is pressed, it runs de addNewTask()
newTaskInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    addNewTask();
  }
});

function showTasks() {
  tasksLocal.forEach((task, i) => {
    // li
    let newTaskLi = document.createElement("li");
    newTaskLi.classList.add("list-item");

    // input inside li
    let newTaskText = document.createElement("span");
    newTaskText.classList.add("item-text");

    let checkbox = document.createElement("INPUT");
    checkbox.setAttribute("type", "checkbox");
    checkbox.classList.add("item-checkbox");
    checkbox.checked = false;
    newTaskText.classList.remove("checked");

    let taskContainer = document.createElement("div");
    taskContainer.classList.add("task-container");

    taskContainer.appendChild(checkbox);
    taskContainer.appendChild(newTaskText);

    newTaskLi.appendChild(taskContainer);

    // adds <li> in the <ul>
    taskList.appendChild(newTaskLi);

    newTaskText.onclick = (e) => {
      newTaskOldValueIndex = tasksLocal.indexOf(e.target.value);

      function editText() {
        tasksLocal.splice(newTaskOldValueIndex, 1, newTaskText.value);
        localStorage.setItem("todos", JSON.stringify(tasksLocal));
      }

      newTaskText.addEventListener("keyup", editText);
    };

    // creating the trash can element
    let trashCan = document.createElement("span");
    trashCan.classList.add("trash-can");
    trashCan.innerHTML = `<i class="fa-solid fa-trash-can"></i>`;

    newTaskLi.appendChild(trashCan);

    // puts the input text into the <p>
    newTaskText.textContent = tasksLocal[i];

    checkbox.addEventListener("click", () => {
      checkItem(checkbox, newTaskLi, newTaskText);
    });

    // REMOVES AN ITEM FROM THE LIST
    trashCan.onclick = () => {
      newTaskLi.remove();
      let element = tasksLocal.indexOf(newTaskText.textContent);
      tasksLocal.splice(element, 1);
      localStorage.setItem("todos", JSON.stringify(tasksLocal));
    };
  });
}

if (tasksLocal !== null) {
  showTasks();
}

function showCompletedTasks() {
  completedTasksLocal.forEach((task, i) => {
    // li
    let newTaskLi = document.createElement("li");
    newTaskLi.classList.add("list-item");

    // input inside li
    let newTaskText = document.createElement("INPUT");
    newTaskText.classList.add("item-text");
    newTaskText.readOnly = true;

    let checkbox = document.createElement("INPUT");
    checkbox.setAttribute("type", "checkbox");
    checkbox.classList.add("item-checkbox");
    checkbox.checked = true;
    newTaskText.classList.add("checked");

    let taskContainer = document.createElement("div");
    taskContainer.classList.add("task-container");

    taskContainer.appendChild(checkbox);
    taskContainer.appendChild(newTaskText);

    newTaskLi.appendChild(taskContainer);

    // adds <li> in the <ul>
    completedTasks.appendChild(newTaskLi);

    // creating the trash can element
    let trashCan = document.createElement("span");
    trashCan.classList.add("trash-can");
    trashCan.classList.add("completed");
    trashCan.innerHTML = `<i class="fa-solid fa-trash-can"></i>`;

    newTaskLi.appendChild(trashCan);

    // puts the input text into the <p>
    newTaskText.value = completedTasksLocal[i];

    checkbox.addEventListener("click", () => {
      checkItem(checkbox, newTaskLi, newTaskText);
    });

    // REMOVES AN ITEM FROM THE LIST
    trashCan.addEventListener("click", () => {
      if (trashCan.classList.contains("completed")) {
        newTaskLi.remove();
        let element = completedTasksLocal.indexOf(newTaskText.textContent);
        completedTasksLocal.splice(element, 1);
        localStorage.setItem(
          "completedTodos",
          JSON.stringify(completedTasksLocal)
        );
      }
    });
  });
}

if (completedTasksLocal !== null) {
  showCompletedTasks();
}

let clear = document.querySelector("#clear");

function clearCompletedTasks() {
  completedTasks.innerHTML = "";
  localStorage.removeItem("completedTodos");
}

clear.addEventListener("click", clearCompletedTasks);

// Container with the title and the arrow
let completedTasksBtn = document.querySelector(".completed-tasks__btn");
let toggleCompletedTasksLocal = localStorage.getItem("toggle");

function toggleCompletedTasks() {
  completedTasks.classList.toggle("hidden");
  clear.classList.toggle("hidden");

  let arrow = document.querySelector(".arrow");
  if (completedTasks.classList.contains("hidden")) {
    // Changes the icon
    arrow.innerHTML = `<i class="fa-solid fa-chevron-up"></i>`;
    // Stores the current "position" (hidden)
    localStorage.setItem("toggle", "hidden");
  } else {
    arrow.innerHTML = `<i class="fa-solid fa-chevron-down"></i>`;
    localStorage.removeItem("toggle");
  }
}

completedTasksBtn.addEventListener("click", toggleCompletedTasks);

if (toggleCompletedTasksLocal !== null) {
  toggleCompletedTasks();
}

// Dark mode

let darkModeBtn = document.querySelector("#toggle-dark-mode");
let currentMode = localStorage.getItem("darkMode");

function toggleDarkMode() {
  document.body.classList.toggle("dark");

  if (document.body.classList.contains("dark")) {
    darkModeBtn.checked = true;
    localStorage.setItem("darkMode", "enabled");
  } else {
    darkModeBtn.checked = false;
    localStorage.removeItem("darkMode");
  }
}

if (currentMode !== null) {
  toggleDarkMode();
}

darkModeBtn.addEventListener("click", toggleDarkMode);
