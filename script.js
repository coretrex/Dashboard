document.addEventListener('DOMContentLoaded', function() {
    initializePage();
});

function initializePage() {
    initializeFileUploads();
    initializeFlatpickr();
    initializeDropdownMenus();
    initializeCountdownTimer();
    initializeGrowthCalculator();
    showPageContent();
}

function initializeFlatpickr() {
    document.querySelectorAll(".date-cell, .future-date").forEach(input => {
        flatpickr(input, {
            dateFormat: "m/d/y",
            allowInput: true,
            clickOpens: true,
            onChange: function(selectedDates, dateStr, instance) {
                input.innerText = dateStr;
            }
        });
    });
}

function initializeDropdownMenus() {
    document.querySelectorAll('.dropdown').forEach(dropdown => {
        dropdown.addEventListener('click', function(event) {
            event.stopPropagation();
            dropdown.querySelector('.dropdown-content').classList.toggle('show');
        });
    });

    window.addEventListener('click', function() {
        document.querySelectorAll('.dropdown-content').forEach(content => {
            content.classList.remove('show');
        });
    });
}

function editField(element) {
    const span = element.closest('li').querySelector('span[contenteditable]');
    span.contentEditable = true;
    span.focus();
    span.onblur = function() {
        span.contentEditable = false;
    };
}

function deleteField(element) {
    const listItem = element.closest('li');
    listItem.remove();
}

function initializeCountdownTimer() {
    const countdownElement = document.getElementById('countdown-timer');
    if (!countdownElement) return;

    const endOfQuarter = getEndOfNearestQuarter();

    function updateCountdown() {
        const now = new Date();
        const timeRemaining = endOfQuarter - now;

        if (timeRemaining <= 0) {
            countdownElement.innerHTML = "Time's up!";
            document.getElementById('countdown-text').innerHTML = "";
            return;
        }

        const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

        countdownElement.innerHTML = `${days}d ${hours}h ${minutes}m ${seconds}s`;
        document.getElementById('countdown-text').innerHTML = "remaining until the end of the quarter.";
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);
}

function getEndOfNearestQuarter() {
    const now = new Date();
    const year = now.getFullYear();
    const quarters = [
        new Date(year, 2, 31),  // Q1
        new Date(year, 5, 30),  // Q2
        new Date(year, 8, 30),  // Q3
        new Date(year, 11, 31)  // Q4
    ];

    for (const quarterEnd of quarters) {
        if (now <= quarterEnd) {
            return quarterEnd;
        }
    }

    // If no quarter end found in the current year, return Q4 of the next year
    return new Date(year + 1, 11, 31);
}

function initializeQuarterlyGoals() {
    const newGoalInput = document.getElementById('new-goal-input');
    newGoalInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            const goalText = newGoalInput.value.trim();
            if (goalText !== '') {
                addQuarterlyGoal(goalText);
                newGoalInput.value = '';
            }
        }
    });
}

function addQuarterlyGoal(goalText) {
    const goalList = document.getElementById('goal-list');
    const listItem = document.createElement('li');
    listItem.textContent = goalText;
    goalList.appendChild(listItem);
}



function initializeFileUploads() {
    const fileInputs = document.querySelectorAll('#file-input, #file-input-annual, #file-input-consumer');
    const imageDisplays = document.querySelectorAll('#image-display, #image-display-annual, #image-display-consumer');
    const uploadedImages = document.querySelectorAll('#uploaded-image, #uploaded-image-annual, #uploaded-image-consumer');
    const lightboxes = document.querySelectorAll('#lightbox, #lightbox-annual, #lightbox-consumer');
    const lightboxImgs = document.querySelectorAll('#lightbox-img, #lightbox-img-annual, #lightbox-img-consumer');
    const deleteButtons = document.querySelectorAll('.delete-button');
    const fileLabels = document.querySelectorAll('.file-label');

    fileInputs.forEach((fileInput, index) => {
        const imageDisplay = imageDisplays[index];
        const uploadedImage = uploadedImages[index];
        const lightbox = lightboxes[index];
        const lightboxImg = lightboxImgs[index];
        const deleteButton = deleteButtons[index];
        const fileLabel = fileLabels[index];

        if (fileInput && imageDisplay && uploadedImage && lightbox && lightboxImg && deleteButton && fileLabel) {
            fileInput.addEventListener('change', function(event) {
                const file = event.target.files[0];
                if (file && file.type.startsWith('image/')) {
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        uploadedImage.src = e.target.result;
                        imageDisplay.style.display = 'flex';
                        fileLabel.style.display = 'none';
                        deleteButton.style.display = 'flex';
                    };
                    reader.readAsDataURL(file);
                }
            });

            uploadedImage.addEventListener('click', function() {
                lightboxImg.src = uploadedImage.src;
                lightbox.style.display = 'flex';
            });

            lightbox.addEventListener('click', function(e) {
                if (e.target !== lightboxImg) {
                    lightbox.style.display = 'none';
                }
            });

            deleteButton.addEventListener('click', function() {
                uploadedImage.src = '#';
                imageDisplay.style.display = 'none';
                fileLabel.style.display = 'flex';
                deleteButton.style.display = 'none';
                fileInput.value = ''; // Reset the file input
            });
        }
    });
}

// Function to add a new week column to the KPI table
function addWeekColumn() {
    const table = document.getElementById('kpi-table');
    const headerRow = table.rows[0];

    // Insert new header cell after 'Goal' column
    const newHeaderCell = headerRow.insertCell(2);
    newHeaderCell.outerHTML = `<th class="date-cell">MM/DD/YY</th>`;

    // Add a new editable cell to each row for the new week
    for (let i = 1; i < table.rows.length; i++) {
        const newRowCell = table.rows[i].insertCell(2);
        newRowCell.contentEditable = "true";
        newRowCell.innerText = ""; // Ensure the new cell is blank
    }

    updateTableWidth();
    initializeFlatpickr();
}

// Function to add a new KPI row to the KPI table
function addKpiRow() {
    const table = document.getElementById('kpi-table').getElementsByTagName('tbody')[0];
    const newRow = table.insertRow();

    const kpiCell = newRow.insertCell(0);
    kpiCell.contentEditable = "true";
    kpiCell.innerText = "New KPI";

    const goalCell = newRow.insertCell(1);
    goalCell.contentEditable = "true";
    goalCell.innerText = "New Goal";

    // Add new editable cells for each week column
    const numOfWeeks = document.getElementById('kpi-table').rows[0].cells.length - 2; // excluding KPI and Goal columns
    for (let i = 0; i < numOfWeeks; i++) {
        const weekCell = newRow.insertCell(2 + i);
        weekCell.contentEditable = "true";
        weekCell.innerText = "";
    }

    initializeFlatpickr();
}

// Function to update table width and add scroll bar if necessary
function updateTableWidth() {
    const tableContainer = document.querySelector('.kpi-table-container');
    tableContainer.style.overflowX = 'auto';
    tableContainer.scrollLeft = tableContainer.scrollWidth; // Scroll to the end when a new column is added
}

// Function to show the page content
function showPageContent() {
    document.querySelectorAll('body > div').forEach(div => {
        div.style.display = 'block';
    });
}

// Function to dynamically load content
function loadContent(event, url) {
    event.preventDefault();
    fetch(url)
        .then(response => response.text())
        .then(html => {
            document.getElementById('main-content').innerHTML = html;
            initializePage(); // Re-initialize the page to ensure all scripts work on the newly loaded content
        })
        .catch(error => {
            console.error('Error loading content:', error);
        });
}

// Vision Scripting
document.addEventListener('DOMContentLoaded', function() {
    initializePage();
});

function handleAddItem(event, listId, inputId) {
    if (event.key === 'Enter') {
        addItem(listId, inputId);
    }
}

function addItem(listId, inputId) {
    const input = document.getElementById(inputId);
    const value = input.value.trim();
    if (value) {
        addItemToList(listId, value);
        input.value = '';
    }
}

function addItemToList(listId, value) {
    const list = document.getElementById(listId);
    const listItem = document.createElement('li');
    const span = document.createElement('span');
    if (listId === 'unique-value-proposition-list' || listId === 'guarantee-list') {
        span.classList.add('italic-preview');
    }
    span.contentEditable = true;
    span.textContent = value;
    
    // Add focus event listener to clear sample text
    span.addEventListener('focus', clearSampleText);

    const dropdown = document.createElement('div');
    dropdown.classList.add('dropdown');

    const dropdownButton = document.createElement('button');
    dropdownButton.innerHTML = '<i class="fas fa-ellipsis-h"></i>';
    dropdownButton.classList.add('dropdown-icon');

    const dropdownContent = document.createElement('div');
    dropdownContent.classList.add('dropdown-content');

    const editOption = document.createElement('a');
    editOption.innerHTML = '<i class="fas fa-edit"></i> Edit';
    editOption.href = '#';
    editOption.onclick = function () {
        span.contentEditable = true;
        span.focus();
        span.onblur = function () {
            span.contentEditable = false;
        };
    };

    const deleteOption = document.createElement('a');
    deleteOption.innerHTML = '<i class="fas fa-trash"></i> Delete';
    deleteOption.href = '#';
    deleteOption.onclick = function () {
        list.removeChild(listItem);
    };

    dropdownContent.appendChild(editOption);
    dropdownContent.appendChild(deleteOption);
    dropdown.appendChild(dropdownButton);
    dropdown.appendChild(dropdownContent);

    listItem.appendChild(span);
    listItem.appendChild(dropdown);
    list.appendChild(listItem);
}

function clearSampleText(event) {
    const span = event.target;
    if (span.textContent === 'Enter Age' || span.textContent === 'Enter Sex' || span.textContent === 'Enter Household Income' || span.textContent === 'Enter Location' || span.textContent === 'Enter Education') {
        span.textContent = '';
    }
    span.removeEventListener('focus', clearSampleText);
}

function editField(element) {
    const span = element.closest('li').querySelector('span[contenteditable]');
    span.contentEditable = true;
    span.focus();
    span.onblur = function() {
        span.contentEditable = false;
    };
}

function deleteField(element) {
    const listItem = element.closest('li');
    listItem.parentNode.removeChild(listItem);
}

// Growth Calculator functions
function initializeGrowthCalculator() {
    document.querySelectorAll('input[type="range"]').forEach(input => {
        input.addEventListener('input', function() {
            const value = this.value;
            if (this.id === 'rangeInput') {
                updateRangeValue(value);
            } else if (this.id === 'organicInput') {
                updateOrganicValue(value);
            } else if (this.id === 'adsConversionInput') {
                updateAdsConversionValue(value);
            }
        });
    });

    document.getElementById('calculatePageViewsBtn').addEventListener('click', calculatePageViews);
}

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
            <button class="on-hold-btn" onclick="moveToOnHold(this)"><i class="fas fa-hand-paper"></i></button>
            <button class="done-btn" onclick="markAsCompleted(this)"><i class="fas fa-check"></i></button>
            <button class="delete-task-btn" onclick="deleteTask(this)"><i class="fas fa-times"></i></button>
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
    console.log('Task marked as completed, launching confetti...');
    launchConfetti();
}

// Function to launch confetti explosion
function launchConfetti() {
    console.log('Launching confetti...');
    confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
    });
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
