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
    xlabelFormat: 'yyyy MMM',
    xtooltipFormat: 'yyyy MMM',
  },
  DAILY: {
    unit: 'days',
    dataFormat: 'yyyy LLL dd',
    xlabelFormat: 'MMM dd',
    xtooltipFormat: 'yyyy MMM dd',
  },
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
  console.log(raw);
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
  let date = DateTime.fromMillis(raw.from).toUTC();
  for (let i = 0; i < raw.count; i++) {
    if (raw.incomes) {
      const value = raw.incomes[i] ?? 0;
      incomes.data.push({ x: date.toFormat(metricMap[raw.metric].dataFormat), y: value });
    }
    if (raw.expenses) {
      const value = raw.incomes ? raw.expenses[i] ?? 0 : Math.abs(raw.expenses[i] ?? 0); // abs if no income in data
      expenses.data.push({ x: date.toFormat(metricMap[raw.metric].dataFormat), y: value });
    }
    date = date.plus(increment);
  }

  if (expenses.data.length > 0) {
    dataset.series.push(expenses);
  }
  if (incomes.data.length > 0) {
    dataset.series.push(incomes);
  }
  console.log(dataset);
  return dataset;
}

export {
  buildAreaChartData,
  buildPieChartData,
  buildStackColumnData,
}