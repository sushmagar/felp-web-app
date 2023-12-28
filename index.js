window.onload = function () {
    fetch('data/budget.json')
        .then(function (jsonBudgetText) {
            return jsonBudgetText.json();
        })
        .then(function (budget) {
            loadBudgetSummary(budget);
            loadBudgetSections(budget);
        });
}


function loadBudgetSummary(budget) {
    loadBudgetSummaryHead(budget);
    loadSectionSummaryList(budget);
}

function loadBudgetSections(budget) {
    const budgetSectionsElement = document.getElementById('budget-sections');
    // add Income Section
    const incomeSectionElement = buildBudgetSectionElement(budget.incomeSection);
    budgetSectionsElement.appendChild(incomeSectionElement);

    //add Needs Section
    const needsSectionElement = buildBudgetSectionElement(budget.needsSection);
    budgetSectionsElement.appendChild(needsSectionElement);

    // add wants section
    const wantsSectionElement = buildBudgetSectionElement(budget.wantsSection);
    budgetSectionsElement.appendChild(wantsSectionElement);

    //add savingAndDebt Section 
    const savingAndDebtSectionElement = buildBudgetSectionElement(budget.savingAndDebtSection);
    budgetSectionsElement.appendChild(savingAndDebtSectionElement);


}

function buildBudgetSectionElement(budgetSection) {
    const sectionCategoryListElement = buildSectionCategoryListElement(budgetSection);
    return createElementFrom(`<section class="card">
                                <h1 class="heading">${budgetSection.name}</h1>
                                ${sectionCategoryListElement.innerHTML}
                            </section>`);
}

function buildSectionCategoryListElement(budgetSection) {
    const sectionCategoryListElement = createElementFrom(`<ul class="section-category-list"></ul>`);

    for (const budgetCategory of budgetSection.categories) {
        const sectionCategoryListItemElement = buildSectionCategoryListItemElement(budgetCategory);
        sectionCategoryListElement.appendChild(sectionCategoryListItemElement);
    }
    //
    const sectionCategoryListItemForAdditionElement = buildSectionCategoryListItemForAdditionElement();
    sectionCategoryListElement.appendChild(sectionCategoryListItemForAdditionElement);
    return sectionCategoryListElement;
}
function buildSectionCategoryListItemForAdditionElement() {
    return createElementFrom(`<li class="section-category-list-item">
                                <i class="fa-solid fa-plus category-add-icon"></i>
                                <span>Add category</span> 
                            </li>`);
}

function buildSectionCategoryListItemElement(budgetCategory) {
    const sectionCategoryListItemElement = createElementFrom(`<li class="section-category-list-item">
                                                                     <i class="fa-solid ${budgetCategory.icon} category-icon"></i>
                                                                     <span class="section-category-name">${budgetCategory.name}</span>
                                                                     <span class="section-category-amount">${formatAmount(budgetCategory.amount)}</span>
                                                                  </li>`);
    return sectionCategoryListItemElement;
}

function createElementFrom(htmlString) {
    const template = document.createElement('template');
    template.innerHTML = htmlString;
    const result = template.content.children;
    return result[0];
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
    totalPlannedExpensesElement.innerText = formatAmount(budget.summary.totalPlannedExpenses);
}

function loadBudgetOutcome(budget) {
    const budgetOutcomeElement = document.getElementById('budget-outcome');
    budgetOutcomeElement.innerHTML = `<strong>${formatAmount(budget.summary.budgetOutcome.amount)}</strong> ${budget.summary.budgetOutcome.note}`;
}
function loadNeedsSummary(budget) {
    const needsIconElement = document.getElementById('needs-icon');
    needsIconElement.style.opacity = 1;

    const needsNameElement = document.getElementById('needs-name');
    needsNameElement.innerText = budget.summary.plannedExpenses.needs.name;

    const needsPercentageElement = document.getElementById('needs-percentage');
    needsPercentageElement.innerText = `${budget.summary.plannedExpenses.needs.percentage}%`;

    const needsAmountElement = document.getElementById('needs-amount');
    needsAmountElement.innerText = formatAmount(budget.summary.plannedExpenses.needs.amount);
}
function loadSavingAndDebtSummary(budget) {
    const savingAndDebtIconElement = document.getElementById('saving-and-debt-icon');
    savingAndDebtIconElement.style.opacity = budget.summary.plannedExpenses.wants.percentage / 100;

    const savingAndDebtNameElement = document.getElementById('saving-and-debt-name');
    savingAndDebtNameElement.innerText = budget.summary.plannedExpenses.savingAndDebt.name;

    const savingAndDebtPercentageElement = document.getElementById('saving-and-debt-percentage');
    savingAndDebtPercentageElement.innerText = `${budget.summary.plannedExpenses.savingAndDebt.percentage}%`

    const savingAndDebtAmountElement = document.getElementById('saving-and-debt-amount');
    savingAndDebtAmountElement.innerText = formatAmount(budget.summary.plannedExpenses.savingAndDebt.amount);
}

function loadWantsSummary(budget) {
    const wantsIconElement = document.getElementById('wants-icon');
    wantsIconElement.style.opacity = budget.summary.plannedExpenses.needs.percentage / 100;

    const wantsNameElement = document.getElementById('wants-name');
    wantsNameElement.innerText = budget.summary.plannedExpenses.wants.name;

    const wantsPercentageElement = document.getElementById('wants-percentage');
    wantsPercentageElement.innerText = `${budget.summary.plannedExpenses.wants.percentage}%`;

    const wantsAmountElement = document.getElementById('wants-amount');
    wantsAmountElement.innerText = formatAmount(budget.summary.plannedExpenses.wants.amount);
}
function formatAmount(amount) {
    return `${amount.currencySymbol}${convertToCurrency(amount.value)}`;
}
function convertToCurrency(number) {
    return new Intl.NumberFormat('en-US').format(number);
}