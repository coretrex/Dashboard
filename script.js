function loadContent(event, page) {
    event.preventDefault();
    console.log(`Loading content from ${page}`);
    
    fetch(page)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.statusText}`);
            }
            return response.text();
        })
        .then(data => {
            console.log(`Content loaded from ${page}`);
            document.getElementById('main-content').innerHTML = data;
        })
        .catch(error => {
            console.error('Error loading the page:', error);
        });
}

// Load the default page (e.g., KPIs) on initial load
document.addEventListener('DOMContentLoaded', function() {
    loadContent(new Event('load'), 'kpis.html');
});

// Growth Calculator functions
function updateRangeValue(value) {
    document.getElementById('rangeValue').innerText = parseFloat(value).toFixed(2) + '%';
}

function updateOrganicValue(value) {
    document.getElementById('organicValue').innerText = value + '%';
}

function updateAdsConversionValue(value) {
    document.getElementById('adsConversionValue').innerText = parseFloat(value).toFixed(2) + '%';
}

function toggleMetrics() {
    const metrics = document.getElementById('marketingMetrics');
    const subtext = document.getElementById('metricsSubtext');
    const icon = document.querySelector('.toggle-icon');
    if (metrics.style.display === 'none' || metrics.style.display === '') {
        metrics.style.display = 'flex';
        subtext.style.display = 'block';
        icon.textContent = '-';
    } else {
        metrics.style.display = 'none';
        subtext.style.display = 'none';
        icon.textContent = '+';
    }
}

function calculatePageViews() {
    let revenueGoal = parseFloat(document.getElementById('revenueGoal').value.replace(/[^\d.-]/g, ''));
    let aov = parseFloat(document.getElementById('aov').value.replace(/[^\d.-]/g, ''));
    const conversionRate = parseFloat(document.getElementById('conversionRate').value) / 100;
    const organicRate = parseFloat(document.getElementById('organicRate').value) / 100;
    const adsConversionRate = parseFloat(document.getElementById('adsConversionRate').value) / 100;
    let cpc = parseFloat(document.getElementById('cpc').value);

    if (isNaN(revenueGoal)) {
        revenueGoal = 1000000; 
    }
    if (isNaN(aov)) {
        aov = 50; 
    }
    if (isNaN(cpc)) {
        cpc = 1.00; 
    }

    const requiredPageViewsAnnually = revenueGoal / (aov * conversionRate);
    const requiredPageViewsDaily = requiredPageViewsAnnually / 365;
    const requiredPageViewsWeekly = requiredPageViewsAnnually / 52;
    const requiredPageViewsMonthly = requiredPageViewsAnnually / 12;

    const nonOrganicRate = 1 - organicRate;
    const requiredNonOrganicPageViewsAnnually = revenueGoal / (aov * adsConversionRate) * nonOrganicRate;
    const requiredNonOrganicPageViewsDaily = requiredNonOrganicPageViewsAnnually / 365;
    const requiredNonOrganicPageViewsWeekly = requiredNonOrganicPageViewsAnnually / 52;
    const requiredNonOrganicPageViewsMonthly = requiredNonOrganicPageViewsAnnually / 12;

    const adSpendAnnually = requiredNonOrganicPageViewsAnnually * cpc;
    const adSpendDaily = adSpendAnnually / 365;
    const adSpendWeekly = adSpendAnnually / 52;
    const adSpendMonthly = adSpendAnnually / 12;

    const resultsElement = document.getElementById('results');
    resultsElement.style.display = 'block';
    resultsElement.innerHTML = `
        <p>To achieve an annual revenue goal of <strong>$${revenueGoal.toLocaleString()}</strong>, with an average order value of <strong>$${aov.toLocaleString()}</strong> and a conversion rate of <strong>${parseFloat(conversionRate * 100).toFixed(2)}%</strong>, you need approximately:</p>
        <ul>
            <li><strong>${Math.round(requiredPageViewsDaily).toLocaleString()}</strong> page views daily</li>
            <li><strong>${Math.round(requiredPageViewsWeekly).toLocaleString()}</strong> page views weekly</li>
            <li><strong>${Math.round(requiredPageViewsMonthly).toLocaleString()}</strong> page views monthly</li>
            <li><strong>${Math.round(requiredPageViewsAnnually).toLocaleString()}</strong> page views annually</li>
        </ul>
        <p>Based on <strong>${(organicRate * 100).toFixed(2)}%</strong> organic page views, an estimated CPC of <strong>$${cpc.toFixed(2)}</strong>, and an ads conversion rate of <strong>${(adsConversionRate * 100).toFixed(2)}%</strong>, to hit your revenue goal of <strong>$${revenueGoal.toLocaleString()}</strong>, your ad spend will be approximately:</p>
        <ul>
            <li><strong>$${adSpendDaily.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</strong> daily to generate <strong>${Math.round(requiredNonOrganicPageViewsDaily).toLocaleString()}</strong> paid page visits</li>
            <li><strong>$${adSpendWeekly.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</strong> weekly to generate <strong>${Math.round(requiredNonOrganicPageViewsWeekly).toLocaleString()}</strong> paid page visits</li>
            <li><strong>$${adSpendMonthly.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</strong> monthly to generate <strong>${Math.round(requiredNonOrganicPageViewsMonthly).toLocaleString()}</strong> paid page visits</li>
            <li><strong>$${adSpendAnnually.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</strong> annually to generate <strong>${Math.round(requiredNonOrganicPageViewsAnnually).toLocaleString()}</strong> paid page visits</li>
        </ul>`;
}

function formatCurrency(input) {
    let value = input.value.replace(/[^\d.-]/g, '');

    if (!isNaN(value) && value !== '') {
        input.value = '$' + parseFloat(value).toLocaleString();
    } else {
        input.value = '';
    }
}

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
            <button onclick="moveToOnHold(this)"><i class="fas fa-hand-paper"></i></button>
            <button onclick="markAsCompleted(this)"><i class="fas fa-check"></i></button>
            <button onclick="deleteTask(this)"><i class="fas fa-times"></i></button>
        </div>
    `;
    taskList.appendChild(taskItem);
}

// Function to delete a task
function deleteTask(button) {
    const taskItem = button.parentElement.parentElement;
    taskItem.remove();
}

// Function to move a task to the on-hold list
function moveToOnHold(button) {
    const taskItem = button.parentElement.parentElement;
    document.getElementById('onhold-task-list').appendChild(taskItem);
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