const { makeExecutableSchema } = require('@graphql-tools/schema');
const Op = require('sequelize').Op
const models = require("./db");
const typeDefs = require("./schema");

const resolvers = {
  Account: {
    async member(account) {
      console.log(`get:Account->member(memberID:${account.memberID})`);
      return await models.Member.findOne({ where: { memberID: account.memberID } });
    },

    async accountShares(account) {
      console.log(`get:Account->accountShares(memberID:${account.memberID})`);
      return await models.AccountShare.findAll({ where: { memberID: account.memberID } });
    },

    async ledgers(account) {
      console.log(`get:Account->ledgers(memberID:${account.memberID})`);
      return await models.Ledger.findAll({ where: { memberID: account.memberID } });
    },
  },

  AccountShare: {
    async account(accountShare) {
      console.log(`get:AccountShare->account(accountID:${accountShare.accountID})`);
      return await models.Account.findOne({ where: { accountID: accountShare.accountID } });
    },

    async member(accountShare) {
      console.log(`get:AccountShare->member(memberID:${accountShare.memberID})`);
      return await models.Member.findOne({ where: { memberID: accountShare.memberID } });
    },
  },

  Category: {
    async member(category) {
      console.log(`get:Category->member(memberID:${category.memberID})`);
      return await models.Member.findOne({ where: { memberID: category.memberID } });
    },
  },

  Ledger: {
    async account(ledger) {
      console.log(`get:Ledger->account(accountID:${ledger.accountID})`);
      return await models.Account.findOne({ where: { accountID: ledger.accountID } });
    },

    async category(ledger) {
      console.log(`get:Ledger->category(categoryID:${ledger.categoryID})`);
      return await models.Category.findOne({ where: { categoryID: ledger.categoryID } });
    },

    async member(ledger) {
      console.log(`get:Ledger->member(memberID:${ledger.memberID})`);
      return await models.Member.findOne({ where: { memberID: ledger.memberID } });
    },
  },

  Member: {
    async accounts(member) {
      console.log(`get:Member->accounts(memberID:${member.memberID})`);
      return await models.Account.findAll({ where: { memberID: member.memberID } });
    },

    async accountShares(member) {
      console.log(`get:Member->accountShares(memberID:${member.memberID})`);
      return await models.AccountShare.findAll({ where: { memberID: member.memberID } });
    },

    async categories(member) {
      console.log(`get:Member->categories(memberID:${member.memberID})`);
      return await models.Category.findAll({ where: { memberID: member.memberID } });
    },

    async ledgers(member) {
      console.log(`get:Member->ledgers(memberID:${member.memberID})`);
      return await models.Ledger.findAll({ where: { memberID: member.memberID } });
    },
  },

  Query: {
    async member(_, { memberID }) {
      console.log(`get:member(memberID:${memberID})`);
      return await models.Member.findOne({
        where: { memberID },
      });
    },

    async memberByEmail(_, { email }) {
      console.log(`get:memberByEmail(email:${email})`);
      return await models.Member.findOne({
        where: { email },
      });
    },

    async ledgersByAccountIDFromTo(_, { accountID, from, to }) {
      console.log(`get:ledgersByAccountIDFromTo(accountID:${accountID},from:${from},to:${to})`);
      return await models.Ledger.findAll({
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

  Mutation: {
    async addMember(_, { email, memberName }) {
      const member = await models.Member.create({ email, memberName });
      return member;
    },

    async addCategory(_, { memberID, categoryName }) {
      const category = await models.Category.create({ memberID, categoryName });
      return category;
    },

    async addAccount(_, { memberID, startBalance }) {
      const account = await models.Account.create({ memberID, startBalance });
      return account;
    },

    async addAccountShare(_, { accountID, memberID }) {
      const accountShare = await models.AccountShare.create({ accountID, memberID });
      return accountShare;
    },

    async addLedger(_, { accountID, memberID, categoryID, amount, description, ledgerFrom, ledgerTo }) {
      const ledger = await models.Ledger.create({
        accountID, memberID, categoryID, amount, description,
        ledgerFrom: ledgerFrom,
        ledgerTo: ledgerTo || ledgerFrom
      });
      return ledger;
    },
  },
};

module.exports = makeExecutableSchema({
  typeDefs,
  resolvers,
});