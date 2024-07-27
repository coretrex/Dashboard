function updateRangeValue(value) {
    document.getElementById('rangeValue').innerText = parseFloat(value).toFixed(2) + '%';
}

function calculatePageViews() {
    let revenueGoal = parseFloat(document.getElementById('revenueGoal').value.replace(/[^\d.-]/g, ''));
    let aov = parseFloat(document.getElementById('aov').value.replace(/[^\d.-]/g, ''));
    const conversionRate = parseFloat(document.getElementById('conversionRate').value) / 100;

    // Set default values if inputs are empty
    if (isNaN(revenueGoal)) {
        revenueGoal = 1000000; // Default annual revenue goal
    }
    if (isNaN(aov)) {
        aov = 50; // Default average order value
    }

    const requiredPageViewsAnnually = revenueGoal / (aov * conversionRate);
    const requiredPageViewsDaily = requiredPageViewsAnnually / 365;
    const requiredPageViewsWeekly = requiredPageViewsAnnually / 52;
    const requiredPageViewsMonthly = requiredPageViewsAnnually / 12;

    const resultsElement = document.getElementById('results');
    resultsElement.style.display = 'block';
    resultsElement.innerHTML = `
        <p>To achieve an annual revenue goal of <strong>$${revenueGoal.toLocaleString()}</strong>, with an average order value of <strong>$${aov.toLocaleString()}</strong> and a conversion rate of <strong>${parseFloat(conversionRate * 100).toFixed(2)}%</strong>, you need approximately:</p>
        <ul>
            <li><strong>${Math.round(requiredPageViewsDaily).toLocaleString()} page views daily</strong></li>
            <li><strong>${Math.round(requiredPageViewsWeekly).toLocaleString()} page views weekly</strong></li>
            <li><strong>${Math.round(requiredPageViewsMonthly).toLocaleString()} page views monthly</strong></li>
            <li><strong>${Math.round(requiredPageViewsAnnually).toLocaleString()} page views annually</strong></li>
        </ul>`;
}

function formatCurrency(input) {
    // Remove all characters except digits and decimal point
    let value = input.value.replace(/[^\d.-]/g, '');

    // Format value with commas
    if (!isNaN(value) && value !== '') {
        input.value = '$' + parseFloat(value).toLocaleString();
    } else {
        input.value = '';
    }
}
