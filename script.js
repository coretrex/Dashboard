// Function to show the modal
function showAddTaskModal() {
    console.log('Showing Add Task Modal');
    document.getElementById('add-task-modal').style.display = 'flex';
    document.body.classList.add('modal-open');
}

// Function to hide the modal
function hideAddTaskModal() {
    console.log('Hiding Add Task Modal');
    document.getElementById('add-task-modal').style.display = 'none';
    document.body.classList.remove('modal-open');
}

// Function to handle adding a task when Enter key is pressed
function handleAddTask(event) {
    if (event.key === 'Enter') {
        console.log('Enter key pressed');
        const taskText = document.getElementById('new-task-input').value;
        if (taskText.trim() !== '') {
            addTask(taskText);
            document.getElementById('new-task-input').value = '';
            hideAddTaskModal();
        }
    }
}

// Function to add a new task to the active tasks list
function addTask(taskText) {
    console.log('Adding Task:', taskText);
    const taskList = document.getElementById('active-task-list');
    const taskItem = document.createElement('li');
    taskItem.className = 'task-item';
    taskItem.draggable = true;
    taskItem.id = `task-${new Date().getTime()}`; // unique id
    taskItem.ondragstart = drag;
    taskItem.innerHTML = `
        <span>${taskText}</span>
        <div class="task-actions">
            <button onclick="markAsCompleted(this)"><i class="fas fa-check"></i></button>
        </div>
    `;
    taskList.appendChild(taskItem);
}

// Function to mark a task as completed
function markAsCompleted(button) {
    const taskItem = button.parentElement.parentElement;
    taskItem.classList.add('completed');
    document.getElementById('completed-task-list').appendChild(taskItem);
}

// Function to allow dropping elements
function allowDrop(event) {
    event.preventDefault();
}

// Function to handle drag event
function drag(event) {
    event.dataTransfer.setData("text", event.target.id);
}

// Function to handle drop event
function drop(event) {
    event.preventDefault();
    const data = event.dataTransfer.getData("text");
    const taskItem = document.getElementById(data);
    if (event.target.tagName === 'UL') {
        event.target.appendChild(taskItem);
    } else if (event.target.closest('.task-bucket')) {
        event.target.closest('.task-bucket').querySelector('.task-list').appendChild(taskItem);
    }
}

// Add event listener for document to handle modal close on outside click
document.addEventListener('click', function(event) {
    const modal = document.getElementById('add-task-modal');
    if (event.target === modal) {
        hideAddTaskModal();
    }
});
