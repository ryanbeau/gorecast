var { DateTime } = require('luxon');
const { GraphQLScalarType } = require("graphql");
const { makeExecutableSchema } = require('@graphql-tools/schema');
const { Op } = require('sequelize')
const { sequelize, Member, Category, Account, AccountShare, Ledger, CategoryLedgers } = require("./db");
const typeDefs = require("./schema");
const { mapLedgersAmountToMetric, mapLedgerCategoryAmountToMetric, mapBudgetsProgress } = require("./map")

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

const queryAccountLedgerRange = async (account, from, to, wherePredicates, additionalQuery) => {
  return await Ledger.findAll({
    ...additionalQuery, // prepend additional query statements
    where: {
      accountID: account.accountID,
      [Op.or]: [
        { ledgerFrom: { [Op.between]: [from.valueOf(), to.valueOf()] } }, // ledgerFrom within dates
        { ledgerTo: { [Op.between]: [from.valueOf(), to.valueOf()] } },   // ledgerTo within dates
        { ledgerFrom: { [Op.lte]: to.valueOf() }, ledgerTo: { [Op.gte]: from.valueOf() } }, // completely overlaps from/to
      ],
      ...wherePredicates, // append or overwrite additional predicates
    },
  });
}

const queryMapAccountLedgerRangeByMetric = async (account, from, to, type, additionalQuery) => {
  if (!type || type.length == 0) {
    return null;
  }

  const wherePredicates = { isBudget: false, amount: { [Op.ne]: 0 } };
  if (!type.includes("INCOME")) {
    wherePredicates.amount = { [Op.lt]: 0 }; //expense
  } else if (!type.includes("EXPENSE")) {
    wherePredicates.amount = { [Op.gt]: 0 }; //income
  }

  return await queryAccountLedgerRange(account, from, to, wherePredicates, additionalQuery);
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

    async sumLedgerRangeByMetric(account, { from, to, type, metric }) {
      console.log(`get:Account->sumLedgerRangeByMetric(accountID:${account.accountID},from:${from.valueOf()},to:${to.valueOf()},type:${type},metric:${metric})`);
      if (from.valueOf() > to.valueOf()) {
        to = [from, from = to][0]; //swap dates
      }
      const ledgers = await queryMapAccountLedgerRangeByMetric(account, from, to, type);
      return mapLedgersAmountToMetric(ledgers, metric, from, to);
    },

    async sumLedgerRangeCategoryByMetric(account, { from, to, type, metric }) {
      console.log(`get:Account->sumLedgerRangeByCategory(accountID:${account.accountID},from:${from.valueOf()},to:${to.valueOf()},type:${type},metric:${metric})`);
      if (from.valueOf() > to.valueOf()) {
        to = [from, from = to][0]; //swap dates
      }
      const ledgers = await queryMapAccountLedgerRangeByMetric(account, from, to, type, { include: { model: Category } });
      return mapLedgerCategoryAmountToMetric(ledgers, metric, from, to);
    },

    async sumBudgetsProgress(account, { type }) {
      console.log(`get:Account->sumBudgetsProgress(accountID:${account.accountID},type:${type})`);
      const from = DateTime.utc(2021, 1, 1); // TODO : possibly get date from account instead
      const to = DateTime.utc(2030, 12, 31);
      const additionalQuery = {
        include: { 
          model: Category,
          include: {
            association: CategoryLedgers,
            required: true,
            where: {
              accountID: account.accountID,
              isBudget: false,
              [Op.or]: [
                { ledgerFrom: { [Op.between]: [from.valueOf(), to.valueOf()] } }, // ledgerFrom within dates
                { ledgerTo: { [Op.between]: [from.valueOf(), to.valueOf()] } },   // ledgerTo within dates
                { ledgerFrom: { [Op.lte]: to.valueOf() }, ledgerTo: { [Op.gte]: from.valueOf() } }, // completely overlaps from/to
              ],
            }
          }
        } 
      };

      if (!type || type.length == 0) {
        return null;
      }
    
      const wherePredicates = { isBudget: true, amount: { [Op.ne]: 0 } };
      if (!type.includes("INCOME")) {
        wherePredicates.amount = { [Op.lt]: 0 }; //expense
      } else if (!type.includes("EXPENSE")) {
        wherePredicates.amount = { [Op.gt]: 0 }; //income
      }
    
      const ledgers = await queryAccountLedgerRange(account, from, to, wherePredicates, additionalQuery);

      return mapBudgetsProgress(ledgers);
    }
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
      if (from.valueOf() > to.valueOf()) {
        to = [from, from = to][0]; //swap dates
      }
      return await queryAccountLedgerRange({ accountID }, from, to);
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

  // scalar value conversion
  Date: new GraphQLScalarType({
    name: 'Date',
    description: 'Date custom scalar type',
    parseValue(value) {
      return DateTime.fromMillis(value).toUTC(); // value from client - convert to Date
    },
    serialize(value) {
      return value.valueOf(); // value to client - to Milliseconds from epoch 1970
    },
    parseLiteral(ast) {
      if (ast.kind === Kind.INT) {
        return DateTime.fromMillis(+ast.value).toUTC(); // ast value is always in string format
      }
      return null;
    },
  }),
};

module.exports = {
  schema: makeExecutableSchema({
    typeDefs,
    resolvers,
  }),
  getContext,
}