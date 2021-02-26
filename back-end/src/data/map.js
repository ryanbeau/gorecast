var { DateTime } = require('luxon');

const metricMap = {
  'YEARLY': 'years',
  'MONTHLY': 'months',
  'WEEKLY': 'weeks', // TODO: Week always starts on Monday with Luxon, we may want to make this user customizable
  'DAILY': 'days',
}

const mapLedgersAmountToMetric = (ledgers, metric, from, to) => {
  const unit = metricMap[metric];
  if (!unit) {
    throw new Error(`Unsupported metric: ${metric}`);
  }

  // count years, months, weeks or days based off 'metric'
  const metricCount = Math.ceil(to.diff(from, unit).toObject()[unit]);
  const metricAmounts = { from: from, to: to, count: metricCount };

  const addAmount = (i, ledgerTypeField, amount) => {
    if (Number.isFinite(amount)) {
      if (!metricAmounts[ledgerTypeField]) {
        metricAmounts[ledgerTypeField] = new Array(metricCount);
      }
      metricAmounts[ledgerTypeField][i] = Number.isFinite(metricAmounts[ledgerTypeField][i]) ? metricAmounts[ledgerTypeField][i] + amount : amount;
    }
  }

  for (let i = 0; i < ledgers.length; i++) {
    let clampedAmount = +ledgers[i].amount;

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

    const ledgerTypeField = clampedAmount < 0 ? 'expenses' : 'incomes';
    if (indexStart == indexEnd) {
      addAmount(indexStart, ledgerTypeField, clampedAmount);
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
        addAmount(indexStart, ledgerTypeField, frontAmount);
        metricAmount -= frontAmount;
      }

      // last metric amount - might be partial
      if (metricEndDiff > 0.0001) {
        const endAmount = (metricEndDiff / clampedDiff) * clampedAmount;
        addAmount(indexEnd, ledgerTypeField, endAmount);
        metricAmount -= endAmount;
      }

      metricAmount /= (clampedDiff - metricFrontDiff - metricEndDiff);

      for (let j = indexStart + 1; j < indexEnd; j++) {
        addAmount(j, ledgerTypeField, metricAmount);
      }
    }
  }

  // round the final results 4 decimal places
  for (let i = 0; i < metricCount; i++) {
    if (metricAmounts.expenses) {
      metricAmounts.expenses[i] = Number.isFinite(metricAmounts.expenses[i]) ? metricAmounts.expenses[i].toFixed(2) : null;
    }
    if (metricAmounts.incomes) {
      metricAmounts.incomes[i] = Number.isFinite(metricAmounts.incomes[i]) ? metricAmounts.incomes[i].toFixed(2) : null;
    }
  }

  return metricAmounts;
};

module.exports = {
  mapLedgersAmountToMetric
}