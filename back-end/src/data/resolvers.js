const { makeExecutableSchema } = require('@graphql-tools/schema');
const { Op } = require('sequelize')
const { Member, Category, Account, AccountShare, Ledger } = require("./db");
const typeDefs = require("./schema");

const mapLedgersAmountToMetric = (ledgers, metric, start, end) => {
  const dayms = (1000 * 3600 * 24);

  let metricArray = new Array(12); // TODO : currently this method maps ONLY 'MONTHLY' metric
  
  for (let i = 0; i < ledgers.length; i++) {
    // total days & daily amount
    const totalDays = (ledgers[i].ledgerTo.getTime() - ledgers[i].ledgerFrom.getTime()) / dayms;
    let dailyAmount = ledgers[i].amount;
    if (totalDays > 1) {
      dailyAmount /= totalDays;
    } else if (totalDays < 0) {
      continue; // for precaution as this should never happen with ledgerto being older than ledgerFrom
    }

    // get the newest date from Start or ledgerFrom
    let metricStart = start.getTime() > ledgers[i].ledgerFrom.getTime() ? start : ledgers[i].ledgerFrom;
    do {
      const metricMonth = metricStart.getMonth();

      // set array indice
      if (!Number.isFinite(metricArray[metricMonth])) {
        metricArray[metricMonth] = 0;
      }

      // if a range of days or single day
      if (totalDays > 1) {
        let metricEnd = new Date(metricStart.getFullYear(), metricMonth + 1, 0, 23, 59, 59, 999);

        // ensure metric-end is not beyond ledgerTo or end
        if (metricEnd.getTime() > ledgers[i].ledgerTo.getTime()) {
          metricEnd = ledgers[i].ledgerTo;
        }
        if (metricEnd.getTime() > end.getTime()) {
          metricEnd = end;
        }

        // get days within this metric
        let metricDays = (metricEnd.getTime() - metricStart.getTime()) / dayms;
        metricArray[metricMonth] += metricDays * dailyAmount;
        
        metricStart.setTime(metricEnd.getTime() + 1);
      } else {
        metricArray[metricMonth] += dailyAmount;
        break;
      }

    } while (metricStart.getTime() < end.getTime() && metricStart.getTime() < ledgers[i].ledgerTo.getTime());

  }

  // round the final results
  for (let i = 0; i < metricArray.length; i++) {
    if (Number.isFinite(metricArray[i])) {
      metricArray[i] = Math.round((metricArray[i] + Number.EPSILON) * 100) / 100;
    }
  }

  return metricArray;
}

const getContext = (request) => {
  if (!request.user || !request.user['https://gorecast.com/email']) {
    throw new Error('request user expected');
  }
  return {
    // creates the authorized User - we don't have a hook on Auth0 create account
    getUser: async () => {
      const result = await Member.findOrCreate({
        where: { email: request.user['https://gorecast.com/email'] }
      })
      if (result[1]) { // second element is created boolean
        console.log(`Created registered user:${result[0].email}`);
      }
      return result[0]; //first element is object
    },
  }
}

// GraphQL Resolver
const resolvers = {
  // Models
  Account: {
    async member(account) {
      console.log(`get:Account->member(memberID:${account.memberID})`);
      return await Member.findOne({ where: { memberID: account.memberID } });
    },

    async accountShares(account) {
      console.log(`get:Account->accountShares(memberID:${account.memberID})`);
      return await AccountShare.findAll({ where: { memberID: account.memberID } });
    },

    async ledgers(account) {
      console.log(`get:Account->ledgers(memberID:${account.memberID})`);
      return await Ledger.findAll({ where: { memberID: account.memberID } });
    },

    async incomeByYear(account, { year, metric }) {
      console.log(`get:Account->incomeByYear(accountID:${account.accountID},year:${year},metric:${metric})`);
      const minDate = new Date(year, 0, 1);
      const maxDate = new Date(year, 11, 31, 23, 59, 59, 999);

      // get all ledgers within the given year
      const ledgers = await Ledger.findAll({
        where: {
          accountID: account.accountID,
          isBudget: false,
          amount: { [Op.gt]: 0 }, // income is above 0
          [Op.or]: [
            { ledgerTo: { [Op.between]: [minDate, maxDate] } },
            { ledgerFrom: { [Op.between]: [minDate, maxDate] } },
            {
              ledgerTo: { [Op.lte]: minDate },
              ledgerFrom: { [Op.gte]: maxDate },
            },
          ],
        },
      });

      return mapLedgersAmountToMetric(ledgers, metric, minDate, maxDate);
    },

    async expensesByYear(account, { year, metric }) {
      console.log(`get:Account->expensesByYear(accountID:${account.accountID},year:${year},metric:${metric})`);
      const minDate = new Date(year, 0, 1);
      const maxDate = new Date(year, 11, 31, 23, 59, 59, 999);

      // get all ledgers within the given year
      const ledgers = await Ledger.findAll({
        where: {
          accountID: account.accountID,
          isBudget: false,
          amount: { [Op.lt]: 0 }, // expense is below 0
          [Op.or]: [
            { ledgerTo: { [Op.between]: [minDate, maxDate] } },
            { ledgerFrom: { [Op.between]: [minDate, maxDate] } },
            {
              ledgerTo: { [Op.lte]: minDate },
              ledgerFrom: { [Op.gte]: maxDate },
            },
          ],
        },
      });

      return mapLedgersAmountToMetric(ledgers, metric, minDate, maxDate);
    },
  },

  AccountShare: {
    async account(accountShare) {
      console.log(`get:AccountShare->account(accountID:${accountShare.accountID})`);
      return await Account.findOne({ where: { accountID: accountShare.accountID } });
    },

    async member(accountShare) {
      console.log(`get:AccountShare->member(memberID:${accountShare.memberID})`);
      return await Member.findOne({ where: { memberID: accountShare.memberID } });
    },
  },

  Category: {
    async member(category) {
      console.log(`get:Category->member(memberID:${category.memberID})`);
      return await Member.findOne({ where: { memberID: category.memberID } });
    },
  },

  Ledger: {
    async account(ledger) {
      console.log(`get:Ledger->account(accountID:${ledger.accountID})`);
      return await Account.findOne({ where: { accountID: ledger.accountID } });
    },

    async category(ledger) {
      console.log(`get:Ledger->category(categoryID:${ledger.categoryID})`);
      return await Category.findOne({ where: { categoryID: ledger.categoryID } });
    },

    async member(ledger) {
      console.log(`get:Ledger->member(memberID:${ledger.memberID})`);
      return await Member.findOne({ where: { memberID: ledger.memberID } });
    },
  },

  Member: {
    async accounts(member) {
      console.log(`get:Member->accounts(memberID:${member.memberID})`);
      return await Account.findAll({ where: { memberID: member.memberID } });
    },

    async accountShares(member) {
      console.log(`get:Member->accountShares(memberID:${member.memberID})`);
      return await AccountShare.findAll({ where: { memberID: member.memberID } });
    },

    async categories(member) {
      console.log(`get:Member->categories(memberID:${member.memberID})`);
      return await Category.findAll({ where: { memberID: member.memberID } });
    },

    async ledgers(member) {
      console.log(`get:Member->ledgers(memberID:${member.memberID})`);
      return await Ledger.findAll({ where: { memberID: member.memberID } });
    },
  },

  // Queries
  Query: {
    async me(_, args, context) {
      console.log(`get:me()`);
      return await context.getUser();
    },

    async ledgersByAccountIDFromTo(_, { accountID, from, to }, context) {
      console.log(`get:ledgersByAccountIDFromTo(accountID:${accountID},from:${from},to:${to})`);
      return await Ledger.findAll({
        where: {
          accountID,
          [Op.or]: [
            { ledgerTo: { [Op.between]: [from, to] } },
            { ledgerFrom: { [Op.between]: [from, to] } },
            {
              ledgerTo: { [Op.lte]: from },
              ledgerFrom: { [Op.gte]: to },
            },
          ],
        },
      });
    },
  },

  // Mutations
  Mutation: {
    async addMember(_, { email, memberName }, context) {
      const member = await Member.create({ email, memberName });
      return member;
    },

    async addCategory(_, { memberID, categoryName }) {
      const category = await Category.create({ memberID, categoryName });
      return category;
    },

    async addAccount(_, { memberID, accountName, startBalance }) {
      const account = await Account.create({ memberID, accountName, startBalance });
      return account;
    },

    async addAccountShare(_, { accountID, memberID }) {
      const accountShare = await AccountShare.create({ accountID, memberID });
      return accountShare;
    },

    async addLedger(_, { accountID, memberID, categoryID, amount, description, ledgerFrom, ledgerTo }) {
      const ledger = await Ledger.create({
        accountID, memberID, categoryID, amount, description,
        ledgerFrom: ledgerFrom,
        ledgerTo: ledgerTo || ledgerFrom
      });
      return ledger;
    },
  },
};

module.exports = {
  schema: makeExecutableSchema({
    typeDefs,
    resolvers,
  }),
  getContext,
}