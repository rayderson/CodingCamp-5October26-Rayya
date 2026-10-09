/* =====================================
   BLOOMY LIFE DASHBOARD
   Vanilla JavaScript
===================================== */


/* =========================
   LOCAL STORAGE KEYS
========================= */

const TASKS_KEY = "bloomy_tasks";
const LINKS_KEY = "bloomy_links";
const NAME_KEY = "bloomy_name";
const THEME_KEY = "bloomy_theme";
const TIMER_KEY = "bloomy_timer";


/* =========================
   DOM ELEMENTS
========================= */

const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");
const emptyMessage = document.getElementById("emptyMessage");
const taskCounter = document.getElementById("taskCounter");
const sortTasks = document.getElementById("sortTasks");

const greeting = document.getElementById("greeting");
const displayName = document.getElementById("displayName");
const dateDisplay = document.getElementById("dateDisplay");
const clock = document.getElementById("clock");

const themeToggle = document.getElementById("themeToggle");

const timerDisplay = document.getElementById("timer");
const timerStatus = document.getElementById("timerStatus");

const startTimer = document.getElementById("startTimer");
const pauseTimer = document.getElementById("pauseTimer");
const resetTimer = document.getElementById("resetTimer");

const pomodoroMinutes =
    document.getElementById("pomodoroMinutes");

const saveDuration =
    document.getElementById("saveDuration");

const linkForm = document.getElementById("linkForm");
const linkName = document.getElementById("linkName");
const linkURL = document.getElementById("linkURL");
const linksContainer =
    document.getElementById("linksContainer");

const nameInput = document.getElementById("nameInput");
const saveName = document.getElementById("saveName");


/* =========================
   DATA
========================= */

let tasks =
    JSON.parse(localStorage.getItem(TASKS_KEY)) || [];

let links =
    JSON.parse(localStorage.getItem(LINKS_KEY)) || [
        {
            id: Date.now(),
            name: "Google",
            url: "https://www.google.com"
        },
        {
            id: Date.now() + 1,
            name: "YouTube",
            url: "https://www.youtube.com"
        }
    ];


/* =========================
   SAVE DATA
========================= */

function saveTasks() {
    localStorage.setItem(
        TASKS_KEY,
        JSON.stringify(tasks)
    );
}


function saveLinks() {
    localStorage.setItem(
        LINKS_KEY,
        JSON.stringify(links)
    );
}


/* =========================
   GREETING + CLOCK
========================= */

function updateDateTime() {

    const now = new Date();

    const hour = now.getHours();

    let greetingText;

    if (hour >= 5 && hour < 12) {
        greetingText = "Good morning! ☀️";
    } else if (hour >= 12 && hour < 18) {
        greetingText = "Good afternoon! 🌷";
    } else if (hour >= 18 && hour < 22) {
        greetingText = "Good evening! 🌙";
    } else {
        greetingText = "Still awake? Go rest bestie 🥹";
    }

    greeting.textContent = greetingText;


    const time = now.toLocaleTimeString(
        "en-US",
        {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false
        }
    );

    clock.textContent = time;


    const date = now.toLocaleDateString(
        "en-US",
        {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric"
        }
    );

    dateDisplay.textContent = date;
}


updateDateTime();

setInterval(updateDateTime, 1000);


/* =========================
   CUSTOM NAME
========================= */

function loadName() {

    const savedName =
        localStorage.getItem(NAME_KEY);

    if (savedName) {
        displayName.textContent = savedName;
        nameInput.value = savedName;
    }
}


saveName.addEventListener("click", () => {

    const name =
        nameInput.value.trim();

    if (!name) {
        alert("Please enter your name 🌷");
        return;
    }

    localStorage.setItem(
        NAME_KEY,
        name
    );

    displayName.textContent = name;

    nameInput.value = "";

});


loadName();


/* =========================
   TODO LIST
========================= */

function renderTasks() {

    taskList.innerHTML = "";

    let visibleTasks = [...tasks];

    const sortType = sortTasks.value;


    if (sortType === "newest") {

        visibleTasks.sort(
            (a, b) => b.id - a.id
        );

    } else if (sortType === "oldest") {

        visibleTasks.sort(
            (a, b) => a.id - b.id
        );

    } else if (sortType === "completed") {

        visibleTasks.sort(
            (a, b) => Number(b.completed) -
                      Number(a.completed)
        );

    } else if (sortType === "active") {

        visibleTasks.sort(
            (a, b) => Number(a.completed) -
                      Number(b.completed)
        );

    }


    if (visibleTasks.length === 0) {

        emptyMessage.style.display = "block";

    } else {

        emptyMessage.style.display = "none";
    }


    visibleTasks.forEach(task => {

        const li =
            document.createElement("li");

        li.className = "task-item";

        if (task.completed) {
            li.classList.add("completed");
        }


        const checkbox =
            document.createElement("input");

        checkbox.type = "checkbox";

        checkbox.className = "task-check";

        checkbox.checked = task.completed;


        checkbox.addEventListener(
            "change",
            () => toggleTask(task.id)
        );


        const text =
            document.createElement("span");

        text.className = "task-text";

        text.textContent = task.text;


        const actions =
            document.createElement("div");

        actions.className = "task-actions";


        const editButton =
            document.createElement("button");

        editButton.textContent = "✎";

        editButton.className = "edit-btn";

        editButton.title = "Edit task";


        editButton.addEventListener(
            "click",
            () => editTask(task.id)
        );


        const deleteButton =
            document.createElement("button");

        deleteButton.textContent = "×";

        deleteButton.className = "delete-btn";

        deleteButton.title = "Delete task";


        deleteButton.addEventListener(
            "click",
            () => deleteTask(task.id)
        );


        actions.appendChild(editButton);

        actions.appendChild(deleteButton);


        li.appendChild(checkbox);

        li.appendChild(text);

        li.appendChild(actions);


        taskList.appendChild(li);

    });


    updateTaskCounter();
}


/* =========================
   ADD TASK
========================= */

taskForm.addEventListener(
    "submit",
    event => {

        event.preventDefault();


        const text =
            taskInput.value.trim();


        if (!text) {

            alert(
                "Your task cannot be empty 🌱"
            );

            return;
        }


        const duplicate =
            tasks.some(
                task =>
                    task.text.toLowerCase() ===
                    text.toLowerCase()
            );


        if (duplicate) {

            alert(
                "You already have this task! 👀"
            );

            return;
        }


        const newTask = {

            id: Date.now(),

            text: text,

            completed: false

        };


        tasks.push(newTask);

        saveTasks();

        taskInput.value = "";

        renderTasks();

    }
);


/* =========================
   EDIT TASK
========================= */

function editTask(id) {

    const task =
        tasks.find(
            task => task.id === id
        );


    if (!task) return;


    const newText =
        prompt(
            "Edit your task:",
            task.text
        );


    if (newText === null) return;


    const cleanText =
        newText.trim();


    if (!cleanText) {

        alert(
            "Task cannot be empty 🌷"
        );

        return;
    }


    const duplicate =
        tasks.some(
            item =>
                item.id !== id &&
                item.text.toLowerCase() ===
                cleanText.toLowerCase()
        );


    if (duplicate) {

        alert(
            "That task already exists 👀"
        );

        return;
    }


    task.text = cleanText;

    saveTasks();

    renderTasks();
}


/* =========================
   TOGGLE TASK
========================= */

function toggleTask(id) {

    const task =
        tasks.find(
            task => task.id === id
        );


    if (!task) return;


    task.completed =
        !task.completed;


    saveTasks();

    renderTasks();
}


/* =========================
   DELETE TASK
========================= */

function deleteTask(id) {

    const confirmed =
        confirm(
            "Delete this task? 🥺"
        );


    if (!confirmed) return;


    tasks =
        tasks.filter(
            task => task.id !== id
        );


    saveTasks();

    renderTasks();
}


/* =========================
   TASK COUNTER
========================= */

function updateTaskCounter() {

    const total = tasks.length;

    const completed =
        tasks.filter(
            task => task.completed
        ).length;


    taskCounter.textContent =
        `${completed}/${total} done`;
}


sortTasks.addEventListener(
    "change",
    renderTasks
);


renderTasks();


/* =========================
   POMODORO TIMER
========================= */

let savedDuration =
    Number(
        localStorage.getItem(TIMER_KEY)
    ) || 25;


pomodoroMinutes.value =
    savedDuration;


let totalSeconds =
    savedDuration * 60;


let timerInterval = null;

let isRunning = false;


function updateTimerDisplay() {

    const minutes =
        Math.floor(totalSeconds / 60);

    const seconds =
        totalSeconds % 60;


    timerDisplay.textContent =
        `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}


function startPomodoro() {

    if (isRunning) return;


    isRunning = true;

    timerStatus.textContent =
        "Focus mode activated! 🍅✨";


    timerInterval =
        setInterval(() => {

            if (totalSeconds <= 0) {

                clearInterval(timerInterval);

                isRunning = false;

                timerStatus.textContent =
                    "Yay! Focus session complete! 🎉";

                alert(
                    "Pomodoro complete! Time for a little break 🌷"
                );

                return;
            }


            totalSeconds--;

            updateTimerDisplay();

        }, 1000);
}


function pausePomodoro() {

    clearInterval(timerInterval);

    isRunning = false;

    timerStatus.textContent =
        "Paused. Take a tiny breath ♡";
}


function resetPomodoro() {

    clearInterval(timerInterval);

    isRunning = false;

    totalSeconds =
        savedDuration * 60;

    updateTimerDisplay();

    timerStatus.textContent =
        "Ready when you are ♡";
}


startTimer.addEventListener(
    "click",
    startPomodoro
);


pauseTimer.addEventListener(
    "click",
    pausePomodoro
);


resetTimer.addEventListener(
    "click",
    resetPomodoro
);


/* =========================
   CUSTOM POMODORO
========================= */

saveDuration.addEventListener(
    "click",
    () => {

        const minutes =
            Number(
                pomodoroMinutes.value
            );


        if (
            !minutes ||
            minutes < 1 ||
            minutes > 120
        ) {

            alert(
                "Choose between 1 and 120 minutes 🌷"
            );

            return;
        }


        savedDuration = minutes;


        localStorage.setItem(
            TIMER_KEY,
            savedDuration
        );


        resetPomodoro();

        timerStatus.textContent =
            `${minutes}-minute focus session ready! ✨`;

    }
);


updateTimerDisplay();


/* =========================
   QUICK LINKS
========================= */

function renderLinks() {

    linksContainer.innerHTML = "";


    links.forEach(link => {

        const wrapper =
            document.createElement("div");

        wrapper.className = "quick-link";


        const anchor =
            document.createElement("a");

        anchor.href = link.url;

        anchor.target = "_blank";

        anchor.rel = "noopener noreferrer";

        anchor.textContent =
            `🔗 ${link.name}`;


        anchor.style.flex = "1";

        anchor.style.textDecoration =
            "none";

        anchor.style.color =
            "inherit";


        const removeButton =
            document.createElement("button");

        removeButton.className =
            "remove-link";

        removeButton.textContent =
            "×";


        removeButton.addEventListener(
            "click",
            () => deleteLink(link.id)
        );


        wrapper.appendChild(anchor);

        wrapper.appendChild(removeButton);


        linksContainer.appendChild(wrapper);

    });

}


linkForm.addEventListener(
    "submit",
    event => {

        event.preventDefault();


        const name =
            linkName.value.trim();

        let url =
            linkURL.value.trim();


        if (!name || !url) {

            alert(
                "Please fill in both fields 🔗"
            );

            return;
        }


        if (
            !url.startsWith("http://") &&
            !url.startsWith("https://")
        ) {

            url =
                "https://" + url;
        }


        const duplicate =
            links.some(
                link =>
                    link.url.toLowerCase() ===
                    url.toLowerCase()
            );


        if (duplicate) {

            alert(
                "This link is already here 👀"
            );

            return;
        }


        links.push({

            id: Date.now(),

            name: name,

            url: url

        });


        saveLinks();

        renderLinks();


        linkName.value = "";

        linkURL.value = "";

    }
);


function deleteLink(id) {

    links =
        links.filter(
            link => link.id !== id
        );


    saveLinks();

    renderLinks();
}


renderLinks();


/* =========================
   DARK MODE
========================= */

function loadTheme() {

    const theme =
        localStorage.getItem(
            THEME_KEY
        );


    if (theme === "dark") {

        document.body.classList.add(
            "dark"
        );

        themeToggle.textContent = "☀️";

    } else {

        themeToggle.textContent = "🌙";

    }
}


themeToggle.addEventListener(
    "click",
    () => {

        document.body.classList.toggle(
            "dark"
        );


        const dark =
            document.body.classList.contains(
                "dark"
            );


        localStorage.setItem(
            THEME_KEY,
            dark ? "dark" : "light"
        );


        themeToggle.textContent =
            dark ? "☀️" : "🌙";

    }
);


loadTheme();
