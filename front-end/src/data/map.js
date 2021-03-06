var { DateTime } = require('luxon');

// dataFormat is the format for luxon DateTime toFormat()
// xlabelFormat is the format for ApexCharts x axis
// xtooltipFormat is the format for ApexCharts x tooltip value
const metricMap = {
  YEARLY: {
    unit: 'years',
    dataFormat: 'yyyy',
    xlabelFormat: 'yyyy',
    xtooltipFormat: 'yyyy',
  },
  MONTHLY: {
    unit: 'months',
    dataFormat: 'yyyy LLL',
    xlabelFormat: 'MMM',
    xtooltipFormat: 'MMM yyyy',
  },
  WEEKLY: { // TODO: Week always starts on Monday with Luxon, we may want to make this user customizable
    unit: 'weeks',
    dataFormat: 'yyyy LLL',
    xlabelFormat: 'MMM dd',
    xtooltipFormat: 'yyyy MMM dd',
  },
  DAILY: {
    unit: 'days',
    dataFormat: 'yyyy LLL dd',
    xlabelFormat: 'MMM dd',
    xtooltipFormat: 'yyyy MMM dd',
  },
}

const buildLedgersData = (account) => {
  const ledgers = [];
  const len = account?.ledgers?.length ?? 0;
  for (let i = 0; i < len; i++) {
    const ledger = {
      from: DateTime.fromMillis(account.ledgers[i].ledgerFrom).toISODate(),
      to: DateTime.fromMillis(account.ledgers[i].ledgerTo).toISODate(),
      description: account.ledgers[i].description,
      category: account.ledgers[i].category.categoryName,
      amount: account.ledgers[i].amount,
    }
    ledgers.push(ledger);
  }
  return ledgers;
}

const buildCategoryLedgersData = (category) => {
  const ledgers = [];
  const len = category?.ledgers?.length ?? 0;
  for (let i = 0; i < len; i++) {
    const ledger = {
      from: DateTime.fromMillis(category.ledgers[i].ledgerFrom).toISODate(),
      to: DateTime.fromMillis(category.ledgers[i].ledgerTo).toISODate(),
      description: category.ledgers[i].description,
      account: category.ledgers[i].account.accountName,
      amount: category.ledgers[i].amount,
    }
    ledgers.push(ledger);
  }
  return ledgers;
}

const buildBudgetLedgersData = (budget) => {
  const ledgers = [];
  const len = budget?.ledgers?.length ?? 0;
  for (let i = 0; i < len; i++) {
    const ledger = {
      from: DateTime.fromMillis(budget.ledgers[i].ledgerFrom).toISODate(),
      to: DateTime.fromMillis(budget.ledgers[i].ledgerTo).toISODate(),
      description: budget.ledgers[i].description,
      account: budget.ledgers[i].account.accountName,
      amount: budget.ledgers[i].amount,
    }
    ledgers.push(ledger);
  }
  return ledgers;
}

const buildBudgetsData = (raw) => {
  const budgets = [];
  for (let i = 0; i < raw.length; i++) {
    if (raw[i].budget.amount !== 0) {
      const budget = {
        ledgerID: raw[i].budget.ledgerID,
        budgetDescription: raw[i].budget.description,
        categoryID: raw[i].category.categoryID,
        categoryName: raw[i].category.categoryName,
        budgetAmount: raw[i].budget.amount,
      }
      budget.currentAmount = ((raw[i].income || 0) + (raw[i].expense || 0)).toFixed(2);
      if (budget.currentAmount != 0) {
        budgets.push(budget);
      }
    }
  }
  return budgets;
}

const buildAreaChartData = (raw) => {
  const increment = { [metricMap[raw.metric].unit]: 1 };
  const dataset = {
    series: [],
    xtype: 'datetime',
    xlabelFormat: metricMap[raw.metric].xlabelFormat,
    xtooltipFormat: metricMap[raw.metric].xtooltipFormat,
  }
  const expenses = {
    name: 'expense',
    data: [],
  }
  const incomes = {
    name: 'income',
    data: [],
  }
  let date = DateTime.fromMillis(raw.from);
  for (let i = 0; i < raw.count; i++) {
    if (raw.incomes) {
      const value = raw.incomes[i] ?? 0;
        incomes.data.push({ x: date.valueOf(), y: value });
    }
    if (raw.expenses) { // if incomes are null then make expense an abs value
      const value = raw.incomes ? raw.expenses[i] ?? 0 : Math.abs(raw.expenses[i] ?? 0);
      expenses.data.push({ x: date.valueOf(), y: value });
    }
    date = date.plus(increment);
  }

  if (expenses.data.length > 0) {
    dataset.series.push(expenses);
  }
  if (incomes.data.length > 0) {
    dataset.series.push(incomes);
  }
  return dataset;
}

const buildPieChartData = (raw) => {
  const dataset = {
    labels: [],
    series: [],
    xtype: 'datetime',
    xlabelFormat: metricMap[raw.metric].xlabelFormat,
    xtooltipFormat: metricMap[raw.metric].xtooltipFormat,
  }

  for (let i = 0; i < raw.categories.length; i++) {
    let amount;
    for (let j = 0; j < raw.count; j++) {
      if (raw.categories[i].expenses && Number.isFinite(raw.categories[i].expenses[j])) {
        amount = amount ? amount + raw.categories[i].expenses[j] : raw.categories[i].expenses[j];
      }
      if (raw.categories[i].incomes && Number.isFinite(raw.categories[i].incomes[j])) {
        amount = amount ? amount + raw.categories[i].incomes[j] : raw.categories[i].incomes[j];
      }
    }
    if (Number.isFinite(amount)) {
      dataset.labels.push(raw.categories[i].category.categoryName);
      dataset.series.push(Math.abs(amount)); // donut/pie MUST be positive
    }
  }
  return dataset;
}

const buildStackColumnData = (raw) => {
  const increment = { [metricMap[raw.metric].unit]: 1 };
  const dataset = {
    categories: [],
    series: [],
    xtype: 'datetime',
    xlabelFormat: metricMap[raw.metric].xlabelFormat,
    xtooltipFormat: metricMap[raw.metric].xtooltipFormat,
  }
  const expenses = {
    name: 'expense',
    data: [],
  }
  const incomes = {
    name: 'income',
    data: [],
  }
  let date = DateTime.fromMillis(raw.from).toUTC();
  for (let i = 0; i < raw.count; i++) {
    if (raw.incomes) {
      const value = raw.incomes[i] ?? 0;
      incomes.data.push(value);
    }
    if (raw.expenses) {
      const value = raw.incomes ? raw.expenses[i] ?? 0 : Math.abs(raw.expenses[i] ?? 0); // abs if no income in data
      expenses.data.push(value);
    }
    dataset.categories.push(date.valueOf());

    date = date.plus(increment);
  }

  if (expenses.data.length > 0) {
    dataset.series.push(expenses);
  }
  if (incomes.data.length > 0) {
    dataset.series.push(incomes);
  }
  return dataset;
}

export {
  buildLedgersData,
  buildCategoryLedgersData,
  buildBudgetLedgersData,
  buildAreaChartData,
  buildBudgetsData,
  buildPieChartData,
  buildStackColumnData,
}