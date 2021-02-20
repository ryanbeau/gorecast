const Sequelize = require('sequelize');
const { dbPort, dbHost, dbUser, dbPassword } = require("../config/env.dev");

var sequelize = new Sequelize(
  'gorecast', dbUser, dbPassword,
  {
    host    : dbHost,
    port    : dbPort,
    dialect : 'mysql',
    dialectModule: require('mysql2'),
  }
);

// member
const Member = sequelize.define('member', {
  memberID: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
  },
  memberName: {
    type: Sequelize.STRING,
    allowNull: true,
  },
});

// category
const Category = sequelize.define('category', {
  categoryID: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  memberID: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  categoryName: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

Member.hasMany(Category, {foreignKey: 'memberID', as: 'categories'});
Category.belongsTo(Member, {foreignKey: 'memberID'});

// account
const Account = sequelize.define('account', {
  accountID: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  memberID: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  startBalance: {
    type: Sequelize.DECIMAL(12, 2),
    allowNull: false,
  },
});

Member.hasMany(Account, {foreignKey: 'memberID', as: 'accounts'});
Account.belongsTo(Member, {foreignKey: 'memberID'});

// account share
const AccountShare = sequelize.define('accountShare', {
  accountShareID: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  accountID: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  memberID: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
});

Account.hasMany(AccountShare, {foreignKey: 'accountID', as: 'accountShares'});
AccountShare.belongsTo(Account, {foreignKey: 'accountID'});

Member.hasMany(AccountShare, {foreignKey: 'memberID', as: 'accountShares'});
AccountShare.belongsTo(Member, {foreignKey: 'memberID'});

// ledger
const Ledger = sequelize.define('ledger', {
  ledgerID: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  accountID: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  memberID: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  categoryID: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  amount: {
    type: Sequelize.DECIMAL(9, 2),
    allowNull: false,
  },
  isBudget: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  description: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  ledgerFrom: {
    type: Sequelize.DATE,
    allowNull: false,
  },
  ledgerTo: {
    type: Sequelize.DATE,
    allowNull: false,
  },
});

Account.hasMany(Ledger, {foreignKey: 'accountID', as: 'ledgers'});
Ledger.belongsTo(Account, {foreignKey: 'accountID'});

Member.hasMany(Ledger, {foreignKey: 'accountID', as: 'ledgers'});
Ledger.belongsTo(Member, {foreignKey: 'memberID'});

Category.hasMany(Ledger, {foreignKey: 'accountID', as: 'ledgers'});
Ledger.belongsTo(Category, {foreignKey: 'categoryID'});

sequelize.sync();

module.exports = {
  Member,
  Category,
  Account,
  AccountShare,
  Ledger,
}
