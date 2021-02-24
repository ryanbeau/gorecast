const typeDefs = `
enum GraphMetricType {
    DAILY
    WEEKLY
    MONTHLY
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

    incomeByYear(
        year:   Int!
        metric: GraphMetricType!
    ): [Float]

    expensesByYear(
        year:   Int!
        metric: GraphMetricType!
    ): [Float]
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
    ledgerFrom:  String!
    ledgerTo:    String!
    account:     Account!
    member:      Member!
    category:    Category!
}

type Query {
    me: Member

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
        ledgerFrom:  String!
        ledgerTo:    String!
    ): Ledger!
}
`;

module.exports = typeDefs;