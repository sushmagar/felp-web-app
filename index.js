window.onload = function () {
    fetch('data/budget.json')
        .then(function (jsonBudgetText) {
            return jsonBudgetText.json();
        })
        .then(function (budget) {
            loadBudgetSummary(budget);
        });
}


function loadBudgetSummary(budget) {
    loadBudgetSummaryHead(budget);
    loadSectionSummaryList(budget);
}

function loadBudgetSummaryHead(budget) {
    loadPieChart(budget);
    loadTotalPlannedExpenses(budget);
    loadBudgetOutcome(budget);

}
function loadSectionSummaryList(budget) {
    loadNeedsSummary(budget);
    loadSavingAndDebtSummary(budget);
    loadWantsSummary(budget);
}

function loadPieChart(budget) {

    const pieChartBackground = buildBackgroundContentForPieChart(budget);

    //load pie chart
    const summaryExpensesPieChartElement = document.getElementById('summary-expenses-pie-chart');
    summaryExpensesPieChartElement.style.background = pieChartBackground;

}

function buildBackgroundContentForPieChart(budget) {
    //build background for pie chart
    let backgroundContent = '';
    let colorAlpha = 1;
    let startPercent = 0;
    const baseColor = '172,84,210';

    //needs
    let endPercent = startPercent + budget.summary.plannedExpenses.needs.percentage;
    let color = `rgba(${baseColor},${colorAlpha})`;
    const needsBackgroundContent = `${color} ${startPercent}% ${endPercent}%`;

    //wants
    startPercent = endPercent;
    endPercent = startPercent + budget.summary.plannedExpenses.wants.percentage;
    colorAlpha = budget.summary.plannedExpenses.needs.percentage / 100;
    color = `rgba(${baseColor},${colorAlpha})`;
    const wantsBackgroundContent = `${color} ${startPercent}% ${endPercent}%`;

    //saving and debt
    startPercent = endPercent;
    endPercent = startPercent + budget.summary.plannedExpenses.savingAndDebt.percentage;
    colorAlpha = budget.summary.plannedExpenses.wants.percentage / 100;
    color = `rgba(${baseColor},${colorAlpha})`;
    const savingAndDebtBackgroundContent = `${color} ${startPercent}% ${endPercent}%`;

    //build background content
    if (endPercent < 100) {
        //leftover
        startPercent = endPercent;
        endPercent = 100;
        color = '#ffffff';
        const leftoverBackgroundContent = `${color} ${startPercent}% ${endPercent}%`;
        backgroundContent = `${needsBackgroundContent}, ${wantsBackgroundContent}, ${savingAndDebtBackgroundContent}, ${leftoverBackgroundContent}`;

    }
    else {
        backgroundContent = `${needsBackgroundContent}, ${wantsBackgroundContent}, ${savingAndDebtBackgroundContent}`;
    }

    const pieChartBackground = `conic-gradient(${backgroundContent})`;
    return pieChartBackground;
}

function loadTotalPlannedExpenses(budget) {
    const totalPlannedExpensesElement = document.getElementById('total-planned-expenses');
    totalPlannedExpensesElement.innerText = `${budget.currencySymbol}${convertToCurrency(budget.summary.totalPlannedExpenses)}`;
}

function loadBudgetOutcome(budget) {
    const budgetOutcomeElement = document.getElementById('budget-outcome');
    budgetOutcomeElement.innerHTML = `<strong>${budget.currencySymbol}${budget.summary.budgetOutcome.amount}</strong> ${budget.summary.budgetOutcome.note}`;
}
function loadNeedsSummary(budget) {
    const needsNameElement = document.getElementById('needs-name');
    needsNameElement.innerText = budget.summary.plannedExpenses.needs.name;

    const needsPercentageElement = document.getElementById('needs-percentage');
    needsPercentageElement.innerText = `${budget.summary.plannedExpenses.needs.percentage}%`;

    const needsAmountElement = document.getElementById('needs-amount');
    needsAmountElement.innerText = `${budget.currencySymbol}${convertToCurrency(budget.summary.plannedExpenses.needs.amount)}`;
}
function loadSavingAndDebtSummary(budget) {
    const savingAndDebtNameElement = document.getElementById('saving-and-debt-name');
    savingAndDebtNameElement.innerText = budget.summary.plannedExpenses.savingAndDebt.name;

    const savingAndDebtPercentageElement = document.getElementById('saving-and-debt-percentage');
    savingAndDebtPercentageElement.innerText = `${budget.summary.plannedExpenses.savingAndDebt.percentage}%`

    const savingAndDebtAmountElement = document.getElementById('saving-and-debt-amount');
    savingAndDebtAmountElement.innerText = `${budget.currencySymbol}${convertToCurrency(budget.summary.plannedExpenses.savingAndDebt.amount)}`;
}

function loadWantsSummary(budget) {
    const wantsNameElement = document.getElementById('wants-name');
    wantsNameElement.innerText = budget.summary.plannedExpenses.wants.name;

    const wantsPercentageElement = document.getElementById('wants-percentage');
    wantsPercentageElement.innerText = `${budget.summary.plannedExpenses.wants.percentage}%`;

    const wantsAmountElement = document.getElementById('wants-amount');
    wantsAmountElement.innerText = `${budget.currencySymbol}${convertToCurrency(budget.summary.plannedExpenses.wants.amount)}`;
}

function convertToCurrency(number) {
    return new Intl.NumberFormat('en-US').format(number);
}