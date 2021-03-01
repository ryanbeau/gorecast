var { DateTime } = require('luxon');

const metricMap = {
  'YEARLY': 'years',
  'MONTHLY': 'months',
  'WEEKLY': 'weeks', // TODO: Week always starts on Monday with Luxon, we may want to make this user customizable
  'DAILY': 'days',
  getUnit(metric) {
    const unit = this[metric];
    if (!unit) {
      throw new Error(`Unsupported metric: ${metric}`);
    }
    return unit;
  }
}

const clampLedgerRange = (ledger, metrics) => {
  const clamp = {
    from: metrics.from,
    to: metrics.to,
    amount: +ledger.amount,
  }
  const unitStart = metrics.from.startOf(metrics.unit); // important for getting correct indices

  // from
  if (!(clamp.isFromClamped = metrics.from.valueOf() > ledger.ledgerFrom.valueOf())) {
    clamp.from = ledger.ledgerFrom;
  }
  clamp.startClampFromDiff = clamp.from.diff(unitStart, metrics.unit).toObject()[metrics.unit];
  clamp.indexFrom = Math.floor(clamp.startClampFromDiff);

  // to
  if (!(clamp.isToClamped = metrics.to.valueOf() < ledger.ledgerTo.valueOf())) {
    clamp.to = ledger.ledgerTo;
  }
  clamp.startClampToDiff = clamp.to.diff(unitStart, metrics.unit).toObject()[metrics.unit];
  clamp.indexTo = Math.floor(clamp.startClampToDiff);

  // amount
  if (clamp.isFromClamped || clamp.isToClamped) {
    clamp.amount *= (clamp.to.valueOf() - clamp.from.valueOf()) / (ledger.ledgerTo.valueOf() - ledger.ledgerFrom.valueOf());
  }
  return clamp;
}

const internalMapMetrics = (metrics, ledgers, addAmount) => {
  for (let i = 0; i < ledgers.length; i++) {
    const clamp = clampLedgerRange(ledgers[i], metrics);

    if (clamp.indexFrom >= clamp.indexTo || metrics.sumRange) {
      addAmount(clamp.indexFrom, clamp.amount, ledgers[i]);
    } else {
      let metricAmount = clamp.amount;
      const metricFrontDiff = clamp.from.endOf(metrics.unit).diff(clamp.from, metrics.unit).toObject()[metrics.unit];
      const metricEndDiff = clamp.to.diff(clamp.to.startOf(metrics.unit), metrics.unit).toObject()[metrics.unit];
      const clampedDiff = clamp.startClampToDiff - clamp.startClampFromDiff;

      // first metric amount - might be partial
      if (metricFrontDiff > 0.0001) {
        const frontAmount = (metricFrontDiff / clampedDiff) * clamp.amount;
        addAmount(clamp.indexFrom, frontAmount, ledgers[i]);
        metricAmount -= frontAmount;
      }

      // last metric amount - might be partial
      if (metricEndDiff > 0.0001) {
        const endAmount = (metricEndDiff / clampedDiff) * clamp.amount;
        addAmount(clamp.indexTo, endAmount, ledgers[i]);
        metricAmount -= endAmount;
      }

      // middle metrics with loop and const metric amount
      if (clamp.indexFrom + 1 < clamp.indexTo) {
        metricAmount /= (clampedDiff - metricFrontDiff - metricEndDiff);

        for (let j = clamp.indexFrom + 1; j < clamp.indexTo; j++) {
          addAmount(j, metricAmount, ledgers[i]);
        }
      }
    }
  }
}

const mapLedgersAmountToMetric = (ledgers, metric, from, to) => {
  const unit = metricMap.getUnit(metric);
  const metrics = { from, to, unit, metric, count: Math.ceil(to.diff(from, unit).toObject()[unit]) };

  const addAmount = (i, amount) => {
    if (Number.isFinite(amount)) {
      const field = amount < 0 ? 'expenses' : 'incomes';
      if (!metrics[field]) {
        metrics[field] = new Array(metrics.count);
      }
      metrics[field][i] = Number.isFinite(metrics[field][i]) ? metrics[field][i] + amount : amount;
    }
  }

  internalMapMetrics(metrics, ledgers, addAmount);
  
  for (let i = 0; i < metrics.count; i++) {
    if (metrics.expenses) {
      metrics.expenses[i] = Number.isFinite(metrics.expenses[i]) ? metrics.expenses[i].toFixed(2) : null;
    }
    if (metrics.incomes) {
      metrics.incomes[i] = Number.isFinite(metrics.incomes[i]) ? metrics.incomes[i].toFixed(2) : null;
    }
  }

  return metrics;
};

const mapLedgerCategoryAmountToMetric = (ledgers, metric, from, to) => {
  const unit = metricMap.getUnit(metric);
  const metrics = { from, to, unit, metric, count: Math.ceil(to.diff(from, unit).toObject()[unit]), categories: [] };

  const groupByIndex = {};
  let groupByCount = 0;

  const addAmount = (i, amount, ledger) => {
    if (Number.isFinite(amount)) {
      // get category index & object
      let index = groupByIndex[ledger.category.categoryID];
      if (index === undefined) {
        index = groupByCount;
        groupByIndex[ledger.category.categoryID] = index;
        metrics.categories[index] = {
          category: ledger.category
        };
        groupByCount += 1;
      }

      const field = amount < 0 ? 'expenses' : 'incomes';
      if (!metrics.categories[index][field]) {
        metrics.categories[index][field] = new Array(metrics.count);
      }
      metrics.categories[index][field][i] = Number.isFinite(metrics.categories[index][field][i]) ? metrics.categories[index][field][i] + amount : amount;
    }
  }

  internalMapMetrics(metrics, ledgers, addAmount);

  for (let i = 0; i < metrics.categories.length; i++) {
    for (let j = 0; j < metrics.count; j++) {
      if (metrics.categories[i].expenses) {
        metrics.categories[i].expenses[j] = Number.isFinite(metrics.categories[i].expenses[j]) ? metrics.categories[i].expenses[j].toFixed(2) : null;
      }
      if (metrics.categories[i].incomes) {
        metrics.categories[i].incomes[j] = Number.isFinite(metrics.categories[i].incomes[j]) ? metrics.categories[i].incomes[j].toFixed(2) : null;
      }
    }
  }

  return metrics;
}

const mapBudgetsProgress = (ledgers) => {
  const budgets = []

  for (let i = 0; i < ledgers.length; i++) {
    if (ledgers[i]?.category?.ledgers) {
      const budgetProgress = {
        type: ledgers[i].amount < 0 ? 'EXPENSE' : 'INCOME',
        budget: ledgers[i],
        category: ledgers[i].category,
      }

      const addAmount = (_, amount) => {
        if (Number.isFinite(amount)) {
          if (amount < 0) {
            budgetProgress.expense = budgetProgress.expense ? budgetProgress.expense + amount : amount;
          } else {
            budgetProgress.income = budgetProgress.income ? budgetProgress.income + amount : amount;
          }
        }
      }

      const metrics = { from: ledgers[i].ledgerFrom, to: ledgers[i].ledgerTo, unit: 'days', sumRange: true };
      internalMapMetrics(metrics, ledgers[i].category.ledgers, addAmount);

      budgets.push(budgetProgress);
    }
  }

  return budgets;
}

module.exports = {
  mapLedgersAmountToMetric,
  mapLedgerCategoryAmountToMetric,
  mapBudgetsProgress,
}