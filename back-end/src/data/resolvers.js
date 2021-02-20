const Op = require('sequelize').Op
const models = require("./db");

const resolvers = {
  // Queries
  async accountsByMemberEmail({ email }) {
    console.log(`get:accountsByMemberEmail(email:${email})`);
    return models.Account.findAll({
      include: [{
        model: models.Member,
        where: { email },
        required: true,
        right: true,
      }],
    });
  },

  async ledgersByAccountIDFromTo({ accountID, from, to }) {
    console.log(`get:ledgersByAccountIDFromTo(accountID:${accountID},from:${from},to:${to})`);
    return models.Ledger.findAll({
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

  // Mutations
  async addMember({ email, memberName }) {
    const member = await models.Member.create({ email, memberName });
    return member;
  },

  async addCategory({ memberID, categoryName }) {
    const category = await models.Category.create({ memberID, categoryName });
    return category;
  },

  async addAccount({ memberID, startBalance }) {
    const account = await models.Account.create({ memberID, startBalance });
    return account;
  },

  async addAccountShare({ accountID, memberID }) {
    const accountShare = await models.AccountShare.create({ accountID, memberID });
    return accountShare;
  },
  
  async addLedger({ accountID, memberID, categoryID, amount, description, ledgerFrom, ledgerTo }) {
    const ledger = await models.Ledger.create({ accountID, memberID, categoryID, amount, description, 
      ledgerFrom: ledgerFrom, 
      ledgerTo: ledgerTo || ledgerFrom });
    return ledger;
  },
};

module.exports = resolvers