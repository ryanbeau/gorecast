const { makeExecutableSchema } = require('@graphql-tools/schema');
const Op = require('sequelize').Op
const { Member, Category, Account, AccountShare, Ledger } = require("./db");
const typeDefs = require("./schema");

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