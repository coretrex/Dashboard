function showAddTaskModal() {
    document.getElementById('add-task-modal').style.display = 'flex';
    document.body.classList.add('modal-open');
}

function hideAddTaskModal() {
    document.getElementById('add-task-modal').style.display = 'none';
    document.body.classList.remove('modal-open');
}

function handleAddTask(event) {
    if (event.key === 'Enter') {
        const taskText = document.getElementById('new-task-input').value;
        if (taskText.trim() !== '') {
            addTask(taskText);
            document.getElementById('new-task-input').value = '';
            hideAddTaskModal();
        }
    }
}

function addTask(taskText) {
    const taskList = document.getElementById('active-task-list');
    const taskItem = document.createElement('li');
    taskItem.className = 'task-item';
    taskItem.draggable = true;
    taskItem.id = `task-${new Date().getTime()}`; // unique id
    taskItem.ondragstart = drag;
    taskItem.innerHTML = `
        <span>${taskText}</span>
        <div class="task-actions">
            <button onclick="moveToOnHold(this)" class="icon yellow"><i class="fas fa-hand-paper"></i></button>
            <button onclick="markAsCompleted(this)" class="icon green"><i class="fas fa-check"></i></button>
            <button onclick="deleteTask(this)" class="icon red"><i class="fas fa-times"></i></button>
        </div>
    `;
    taskList.appendChild(taskItem);
}

function moveToOnHold(button) {
    const taskItem = button.parentElement.parentElement;
    document.getElementById('onhold-task-list').appendChild(taskItem);
}

function markAsCompleted(button) {
    const taskItem = button.parentElement.parentElement;
    taskItem.classList.add('completed');
    document.getElementById('completed-task-list').appendChild(taskItem);
}

function deleteTask(button) {
    const taskItem = button.parentElement.parentElement;
    taskItem.remove();
}

function allowDrop(event) {
    event.preventDefault();
}

function drag(event) {
    event.dataTransfer.setData("text", event.target.id);
}

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

document.addEventListener('click', function(event) {
    const modal = document.getElementById('add-task-modal');
    if (event.target === modal) {
        hideAddTaskModal();
    }
});
