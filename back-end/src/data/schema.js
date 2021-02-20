var { buildSchema } = require("graphql");

var schema = buildSchema(`
  type Member {
    memberID:   Int!
    email:      String!
    memberName: String
  }

  type Category {
    categoryID:   Int!
    memberID:     Int!
    categoryName: String!
  }

  type Account {
    accountID:    Int!
    memberID:     Int!
    startBalance: Float!
    createdOn:    String!
  }

  type AccountShare {
    accountShareID: Int!
    accountID:      Int!
    memberID:       Int!
  }

  type Ledger {
    ledgerID:    Int!
    accountID:   Int!
    memberID:    Int!
    categoryID:  Int!
    amount:      Float!
    description: String
    ledgerFrom:  String!
    ledgerTo:    String!
  }

  type Query {
    accountsByMemberEmail (
      email: String!
    ): [Account!]

    ledgersByAccountIDFromTo (
      accountID: Int!
      from:      String!
      to:        String!
    ): [Ledger!]
  }

  type Mutation {
    addMember(
      email:      String!
      memberName: String
    ): Member!

    addCategory(
        memberID:     Int!
        categoryName: String!
    ): Category!

    addAccount(
        memberID:     Int!
        startBalance: Float
    ): Account!

    addAccountShare(
        accountID: Int!
        memberID:  Int!
    ): AccountShare!

    addLedger(
        accountID:   Int!
        memberID:    Int!
        categoryID:  Int!
        amount:      Float!
        description: String
        ledgerFrom:  String!
        ledgerTo:    String!
    ): Ledger!
  }
`);

module.exports = schema;