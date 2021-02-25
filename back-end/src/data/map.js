var { DateTime } = require('luxon');

const metricMap = {
  'YEARLY': 'years',
  'MONTHLY': 'months',
  'WEEKLY': 'weeks',
  'DAILY': 'days',
}

const mapLedgersAmountToMetric = (ledgers, metric, from, to) => {
  if (!metricMap[metric]) {
    throw new Error(`Unsupported metric: ${metric}`);
  }

  // count years, months, weeks or days based off 'metric'
  const metricCount = Math.ceil(to.diff(from, metricMap[metric]).toObject()[metricMap[metric]]);
  console.log(`diff: ${Math.ceil(to.diff(from, metricMap[metric]))}`);
  console.log(`metricCount:${metricCount} from:${from.valueOf()} to:${to.valueOf()}`);

  let metricAmounts = {
    from: from,
    to: to,
    count: metricCount,
  }

  console.log(`LEDGER COUNT: ${ledgers.length}`);

  for (let i = 0; i < ledgers.length; i++) {
    console.log(`ledger.id[${ledgers[i].ledgerID}] from:${ledgers[i].ledgerFrom.valueOf()} to:${ledgers[i].ledgerTo.valueOf()}`);

    const metricFrom = from.valueOf() > ledgers[i].ledgerFrom.valueOf() ? from : ledgers[i].ledgerFrom;
    const metricTo = to.valueOf() < ledgers[i].ledgerTo.valueOf() ? to : ledgers[i].ledgerTo;

    const metricIndexStart = from.valueOf() == metricFrom.valueOf() ? 0 : Math.ceil(metricFrom.diff(from, metricMap[metric]).toObject()[metricMap[metric]]) - 1;
    const metricIndexEnd = to.valueOf() == metricTo.valueOf() ? metricCount - 1 : Math.ceil(metricTo.diff(from, metricMap[metric]).toObject()[metricMap[metric]]) - 1;

    console.log(`metricIndexStart:${metricIndexStart} metricIndexEnd:${metricIndexEnd}`);

    if (ledgers[i].amount < 0) {
      if (!metricAmounts.metricExpense) {
        metricAmounts.expense = new Array(metricCount);
      }
    } else {
      if (!metricAmounts.metricIncome) {
        metricAmounts.income = new Array(metricCount);
      }
    }
  }

  // for (let i = 0; i < ledgers.length; i++) {
  //   // total days & daily amount
  //   const totalDays = (ledgers[i].ledgerTo.valueOf() - ledgers[i].ledgerFrom.valueOf()) / dayms;
  //   let dailyAmount = +ledgers[i].amount;
  //   if (totalDays > 1) {
  //     dailyAmount /= totalDays;
  //     console.log(dailyAmount);
  //   } else if (totalDays < 0) {
  //     continue; // for precaution as this should never happen with ledgerto being older than ledgerFrom
  //   }

  //   // get the newest date from 'from' or 'ledgerFrom'
  //   let metricStart = from.valueOf() > ledgers[i].ledgerFrom.valueOf() ? from : ledgers[i].ledgerFrom;
  //   do {
  //     if (totalDays <= 1) {
  //       const ledgerMonth = ledgers[i].ledgerTo.month;
  //       metricArray[ledgerMonth] = metricArray[ledgerMonth] ? metricArray[ledgerMonth] + dailyAmount : dailyAmount;
  //       break; // do not continue since this ledger range was a single day
  //     }

  //     const metricMonth = metricStart.month;
  //     let metricEnd = DateTime.utc(metricStart.year, metricMonth, 0, 23, 59, 59, 999);

  //     // ensure metric-end is not beyond ledgerTo or end
  //     if (metricEnd.valueOf() > ledgers[i].ledgerTo.valueOf()) {
  //       metricEnd = ledgers[i].ledgerTo;
  //     }
  //     if (metricEnd.valueOf() > to.valueOf()) {
  //       metricEnd = to;
  //     }

  //     // get metric amount from days
  //     const metricAmount = ((metricEnd.valueOf() - metricStart.valueOf()) / dayms) * dailyAmount;
  //     metricArray[metricMonth-1] = metricArray[metricMonth-1] ? metricArray[metricMonth-1] + metricAmount : metricAmount;

  //     metricStart = new DateTime(metricEnd.valueOf() + 1);

  //   } while (metricStart.valueOf() < to.valueOf() && metricStart.valueOf() < ledgers[i].ledgerTo.valueOf());

  // }

  // // round the final results
  // for (let i = 0; i < metricArray.length; i++) {
  //   if (Number.isFinite(metricArray[i])) {
  //     metricArray[i] = Math.round((metricArray[i] + Number.EPSILON) * 100) / 100;
  //   }
  // }

  return [];
};

module.exports = {
  mapLedgersAmountToMetric
}