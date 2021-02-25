const { gql } = require('graphql-request');

const typeDefs = gql`
scalar Date

enum GraphMetricType {
    MONTHLY
}

enum LedgerType {
    INCOME
    EXPENSE
}

type CategoryAmount {
    categoryName: String!
    amount:       Float!
}

type Member {
    memberID:      Int!
    email:         String!
    memberName:    String
    accounts:      [Account!]
    accountShares: [AccountShare!]
    categories:    [Category!]
    ledgers:       [Ledger!]
}

type Category {
    categoryID:   Int!
    memberID:     Int!
    categoryName: String!
    member:       Member!
}

type Account {
    accountID:     Int!
    memberID:      Int!
    accountName:   String!
    startBalance:  Float!
    member:        Member!
    accountShares: [AccountShare!]
    ledgers:       [Ledger!]

    sumLedgerRangeByMetric(
        from:   Date!
        to:     Date!
        type:   LedgerType!
        metric: GraphMetricType!
    ): [Float]

    sumLedgerRangeByCategory(
        from:   Date!
        to:     Date!
        type:   LedgerType!
    ): [CategoryAmount]
}

type AccountShare {
    accountShareID: Int!
    accountID:      Int!
    memberID:       Int!
    account:        Account!
    member:         Member!
}

type Ledger {
    ledgerID:    Int!
    accountID:   Int!
    memberID:    Int!
    categoryID:  Int!
    amount:      Float!
    isBudget:    Boolean!
    description: String
    ledgerFrom:  Date!
    ledgerTo:    Date!
    account:     Account!
    member:      Member!
    category:    Category!
}

type Query {
    me: Member

    ledgersByAccountIDFromTo (
        accountID: Int!
        from:      Date!
        to:        Date!
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
        accountName:  String!
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
        ledgerFrom:  Date!
        ledgerTo:    Date!
    ): Ledger!
}
`;

module.exports = typeDefs;