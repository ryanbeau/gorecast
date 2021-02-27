var { DateTime } = require('luxon');

const metricMap = {
  'YEARLY': 'years',
  'MONTHLY': 'months',
  'WEEKLY': 'weeks', // TODO: Week always starts on Monday with Luxon, we may want to make this user customizable
  'DAILY': 'days',
}

const roundMetricResults = (metrics, metricCount) => {
  for (let i = 0; i < metricCount; i++) {
    if (metrics.expenses) {
      metrics.expenses[i] = Number.isFinite(metrics.expenses[i]) ? metrics.expenses[i].toFixed(2) : null;
    }
    if (metrics.incomes) {
      metrics.incomes[i] = Number.isFinite(metrics.incomes[i]) ? metrics.incomes[i].toFixed(2) : null;
    }

    if (metrics.categories) {
      for (let j = 0; j < metricCount; j++) {
        if (metrics.categories[i].expenses) {
          metrics.categories[i].expenses[j] = Number.isFinite(metrics.categories[i].expenses[j]) ? metrics.categories[i].expenses[j].toFixed(2) : null;
        }
        if (metrics.categories[i].incomes) {
          metrics.categories[i].incomes[j] = Number.isFinite(metrics.categories[i].incomes[j]) ? metrics.categories[i].incomes[j].toFixed(2) : null;
        }
      }
    }
  }
}

const mapLedgersAmountToMetric = (ledgers, metric, from, to, groupByCategory) => {
  const unit = metricMap[metric];
  if (!unit) {
    throw new Error(`Unsupported metric: ${metric}`);
  }

  // count years, months, weeks or days based off 'metric'
  const metricCount = Math.ceil(to.diff(from, unit).toObject()[unit]);
  const metrics = { from, to, metric, count: metricCount };

  const addAmount = (parent, i, amount) => {
    if (Number.isFinite(amount)) {
      const field = amount < 0 ? 'expenses' : 'incomes';
      if (!parent[field]) {
        parent[field] = new Array(metricCount);
      }
      parent[field][i] = Number.isFinite(parent[field][i]) ? parent[field][i] + amount : amount;
    }
  }

  let parent = metrics;
  if (groupByCategory) {
    metrics.categories = [];
  }
  const groupByIndex = {};
  let groupByIndexCount = 0;

  for (let i = 0; i < ledgers.length; i++) {
    let clampedAmount = +ledgers[i].amount;

    // set parent to category object if applicable
    if (groupByCategory) {
      let index = groupByIndex[ledgers[i].category.categoryID];
      if (index === undefined) {
        index = groupByIndexCount;
        groupByIndex[ledgers[i].category.categoryID] = index;
        metrics.categories[index] = {
          category: ledgers[i].category
        };
        groupByIndexCount += 1;
      }
      parent = metrics.categories[index];
    }

    // get the min and max dates by clamping ledger if it goes beyond
    const clampedFrom = from.valueOf() > ledgers[i].ledgerFrom.valueOf() ? from : ledgers[i].ledgerFrom;
    const clampedTo = to.valueOf() < ledgers[i].ledgerTo.valueOf() ? to : ledgers[i].ledgerTo;

    // get fraction of ledger amount since ledger dates are clamped (ie beyond 'from' or 'to' range)
    if (ledgers[i].ledgerFrom.valueOf() != clampedFrom.valueOf() || ledgers[i].ledgerTo.valueOf() != clampedTo.valueOf()) {
      clampedAmount *= (clampedTo.valueOf() - clampedFrom.valueOf()) / (ledgers[i].ledgerTo.valueOf() - ledgers[i].ledgerFrom.valueOf());
    }

    // get the indices starting at 0 which is 'from'
    const unitStart = from.startOf(unit); // important for getting correct indices
    const indexStart = from.valueOf() == clampedFrom.valueOf() ? 0 : Math.floor(clampedFrom.diff(unitStart, unit).toObject()[unit]);
    const indexEnd = to.valueOf() == clampedTo.valueOf() ? metricCount - 1 : Math.floor(clampedTo.diff(unitStart, unit).toObject()[unit]);

    if (indexStart == indexEnd) {
      addAmount(parent, indexStart, clampedAmount);
    } else {
      let metricAmount = clampedAmount;

      // get diff from end of first metric
      const metricFrontDiff = clampedFrom.endOf(unit).diff(clampedFrom, unit).toObject()[unit];
      // get diff from start of last metric
      const metricEndDiff = clampedTo.diff(clampedTo.startOf(unit), unit).toObject()[unit];

      const clampedDiff = clampedTo.diff(clampedFrom, unit).toObject()[unit];

      // first metric amount - might be partial
      if (metricFrontDiff > 0.0001) {
        const frontAmount = (metricFrontDiff / clampedDiff) * clampedAmount;
        addAmount(parent, indexStart, frontAmount);
        metricAmount -= frontAmount;
      }

      // last metric amount - might be partial
      if (metricEndDiff > 0.0001) {
        const endAmount = (metricEndDiff / clampedDiff) * clampedAmount;
        addAmount(parent, indexEnd, endAmount);
        metricAmount -= endAmount;
      }

      // middle metrics with loop and const metric amount
      if (indexStart + 1 < indexEnd) {
        metricAmount /= (clampedDiff - metricFrontDiff - metricEndDiff);

        for (let j = indexStart + 1; j < indexEnd; j++) {
          addAmount(parent, j, metricAmount);
        }
      }
    }
  }

  roundMetricResults(metrics, metricCount);
  return metrics;
};

module.exports = {
  mapLedgersAmountToMetric
}