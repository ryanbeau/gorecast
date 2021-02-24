const mapLedgersAmountToMetric = (ledgers, metric, from, to) => {
  const dayms = (1000 * 3600 * 24);

  let metricArray = new Array(12); // TODO : currently this method maps ONLY 'MONTHLY' metric

  for (let i = 0; i < ledgers.length; i++) {
    // total days & daily amount
    const totalDays = (ledgers[i].ledgerTo.getTime() - ledgers[i].ledgerFrom.getTime()) / dayms;
    let dailyAmount = +ledgers[i].amount;
    if (totalDays > 1) {
      dailyAmount /= totalDays;
    } else if (totalDays < 0) {
      continue; // for precaution as this should never happen with ledgerto being older than ledgerFrom
    }

    // get the newest date from 'from' or 'ledgerFrom'
    let metricStart = from.getTime() > ledgers[i].ledgerFrom.getTime() ? from : ledgers[i].ledgerFrom;
    do {
      if (totalDays <= 1) {
        const ledgerMonth = ledgers[i].ledgerTo.getMonth();
        metricArray[ledgerMonth] = metricArray[ledgerMonth] ? metricArray[ledgerMonth] + dailyAmount : dailyAmount;
        break; // do not continue since this ledger range was a single day
      }

      const metricMonth = metricStart.getMonth();
      let metricEnd = new Date(metricStart.getFullYear(), metricMonth + 1, 0, 23, 59, 59, 999);

      // ensure metric-end is not beyond ledgerTo or end
      if (metricEnd.getTime() > ledgers[i].ledgerTo.getTime()) {
        metricEnd = ledgers[i].ledgerTo;
      }
      if (metricEnd.getTime() > to.getTime()) {
        metricEnd = to;
      }

      // get metric amount from days
      const metricAmount = ((metricEnd.getTime() - metricStart.getTime()) / dayms) * dailyAmount;
      metricArray[metricMonth] = metricArray[metricMonth] ? metricArray[metricMonth] + metricAmount : metricAmount;

      metricStart = new Date(metricEnd.getTime() + 1);

    } while (metricStart.getTime() < to.getTime() && metricStart.getTime() < ledgers[i].ledgerTo.getTime());

  }

  // round the final results
  for (let i = 0; i < metricArray.length; i++) {
    if (Number.isFinite(metricArray[i])) {
      metricArray[i] = Math.round((metricArray[i] + Number.EPSILON) * 100) / 100;
    }
  }

  return metricArray;
};

module.exports = {
  mapLedgersAmountToMetric
}