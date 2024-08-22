const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Path to the file where tasks will be stored
const filePath = path.join(__dirname, 'tasks.json');

// Initialize readline interface for user input
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});


// Load tasks from the file
function loadTasks() {
    try {
        const data = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
}

// Save tasks to the file
function saveTasks(tasks) {
    fs.writeFileSync(filePath, JSON.stringify(tasks, null, 2), 'utf8');
}


function addTask(taskDescription) {
    const tasks = loadTasks();
    const newTask = { id: tasks.length + 1, description: taskDescription, completed: false };
    tasks.push(newTask);
    saveTasks(tasks);
    console.log(`Task added: "${taskDescription}"`);
}

function viewTasks() {
    const tasks = loadTasks();
    if (tasks.length === 0) {
        console.log('No tasks available.');
    } else {
        tasks.forEach(task => {
            const status = task.completed ? '[✔]' : '[ ]';
            console.log(`${task.id}. ${status} ${task.description}`);
        });
    }
}

function markTaskComplete(taskId) {
    const tasks = loadTasks();
    const task = tasks.find(t => t.id === taskId);

    if (task) {
        task.completed = true;
        saveTasks(tasks);
        console.log(`Task ${taskId} marked as complete.`);
    } else {
        console.log(`Task ${taskId} not found.`);
    }
}

function removeTask(taskId) {
    let tasks = loadTasks();
    const initialLength = tasks.length;

    tasks = tasks.filter(task => task.id !== taskId);

    if (tasks.length < initialLength) {
        saveTasks(tasks);
        console.log(`Task ${taskId} removed.`);
    } else {
        console.log(`Task ${taskId} not found.`);
    }
}

function mainMenu() {
    console.log('\nTask Manager');
    console.log('1. View Tasks');
    console.log('2. Add Task');
    console.log('3. Mark Task as Complete');
    console.log('4. Remove Task');
    console.log('5. Exit');
    rl.question('Choose an option: ', (option) => {
        switch (option) {
            case '1':
                viewTasks();
                mainMenu();
                break;
            case '2':
                rl.question('Enter task description: ', (desc) => {
                    addTask(desc);
                    mainMenu();
                });
                break;
            case '3':
                rl.question('Enter task ID to mark as complete: ', (id) => {
                    markTaskComplete(parseInt(id));
                    mainMenu();
                });
                break;
            case '4':
                rl.question('Enter task ID to remove: ', (id) => {
                    removeTask(parseInt(id));
                    mainMenu();
                });
                break;
            case '5':
                rl.close();
                break;
            default:
                console.log('Invalid option. Please try again.');
                mainMenu();
                break;
        }
    });
}

// Start the main menu
mainMenu();
