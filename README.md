# Gorecast

This repository contains a React front-end and a node.js back-end that defines an Express API. Follow the instructions below to run the client and server.

## Requirements

* Node 14 or higher ([download]("https://nodejs.org/en/"))

## Get Started

### Front-end

From root, install the front-end dependencies:

```bash
cd front-end/
npm install
```

Add a `.env` file:

```bash
touch .env
```

Populate the front-end `.env` as follows:

```bash
REACT_APP_AUTH0_DOMAIN=
REACT_APP_AUTH0_CLIENT_ID=
REACT_APP_AUTH0_AUDIENCE=
REACT_APP_SERVER_URL=http://localhost:6060
```

Get the values for `REACT_APP_AUTH0_DOMAIN`, `REACT_APP_AUTH0_CLIENT_ID`, and `REACT_APP_AUTH0_AUDIENCE` from Auth0.

With the `.env` configuration values set, run the API server by issuing the following command:

```bash
npm start
```

### Back-end

From root, install the back-end dependencies:

```bash
cd back-end/
npm install
```

Add a `.env` file:

```bash
touch .env
```

Populate the front-end `.env` as follows:

```bash
SERVER_PORT=6060
CLIENT_ORIGIN_URL=http://localhost:4040
AUTH0_AUDIENCE=
AUTH0_DOMAIN=
```

Get the values for `AUTH0_AUDIENCE` and `AUTH0_DOMAIN` from Auth0.


With the `.env` configuration values set, run the API server by issuing the following command:

```bash
npm start
```

### MySQL Database

The default database `gorecast` uses the following default connection values:
```bash
DB_PORT=3306
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=root
```
If these default values require change for local deployment, add them to the `.env` file with required values.

## GraphQL

### GET: Me
```graphql
{
    query Me($from: Date!, $to: Date!) {
        memberID
        email
        memberName
        accounts {
            accountID
            accountName
            startBalance
            sumBudgetsProgress(type:[INCOME, EXPENSE]) {
                type
                budget {
                    ledgerID
                    description
                    amount
                    ledgerFrom
                    ledgerTo
                }
                category {
                    categoryID
                    categoryName
                }
                expense
                income
            }
            yearlyLedgersByMonth: sumLedgerRangeByMetric(from: $from, to: $to, type:[INCOME, EXPENSE], metric: MONTHLY) {
                from
                to
                count
                incomes
                expenses
            }
            yearlyExpenseByCategory: sumLedgerRangeByCategory(from: $from, to: $to, type:EXPENSE) {
                categoryName
                amount
            }
        }
        accountShares {
            accountID
        }
        categories {
            categoryID
            categoryName
        }
        ledgers {
            ledgerID
            accountID
            categoryID
            amount
            isBudget
            description
            ledgerFrom
            ledgerTo
        }
    }
}
```
```json
{
    "from": 1609459200000,
    "to": 1640995199000
}
```

### POST: Add Member
```graphql
mutation addMember($email: String!, $memberName: String) {
    addMember(email: $email, memberName: $memberName) {
        memberID
        email
        memberName
    }
}
```
```json
{
    "email": "email@example.net",
    "memberName": "name"
}
```

### POST: Add Category
```graphql
mutation addCategory($memberID: Int!, $categoryName: String!) {
    addCategory(memberID: $memberID, categoryName: $categoryName) {
        categoryID
        memberID
        categoryName
    }
}
```
```json
{
    "memberID": 1,
    "categoryName": "Salary"
}
```

### POST: Add Account
```graphql
mutation addAccount($memberID: Int!, $accountName: String!, $startBalance: Float) {
    addAccount(memberID: $memberID, accountName: $accountName, startBalance: $startBalance) {
        accountID
        memberID
        accountName
        startBalance
    }
}
```
```json
{
    "memberID": 1,
    "accountName": "Salary",
    "startBalance": 0.00
}
```

### POST: Add Account Share
```graphql
mutation addAccountShare($accountID: Int!, $memberID: Int!) {
    addAccountShare(accountID: $accountID, memberID: $memberID) {
        accountShareID
        accountID
        memberID
    }
}
```
```json
{
    "accountID": 1,
    "memberID": 1
}
```

### POST: Add Ledger
```graphql
mutation addLedger($accountID: Int!, $memberID: Int!, $categoryID: Int!, $amount: Float!, $isBudget: Boolean!, $description: String, $ledgerFrom: Date!, $ledgerTo: Date!) {
    addLedger(accountID: $accountID, memberID: $memberID, categoryID: $categoryID, amount: $amount, isBudget: $isBudget, description: $description, ledgerFrom: $ledgerFrom, ledgerTo: $ledgerTo) {
        ledgerID
        accountID
        memberID
        categoryID
        amount
        isBudget
        description
        ledgerFrom
        ledgerTo
    }
}
```
```json
{
    "accountID": 1,
    "memberID": 1,
    "categoryID": 1,
    "amount": 12345.67,
    "isBudget": false,
    "description": "Yearly Bonus",
    "ledgerFrom": 1609459200000,
    "ledgerTo": 1640995199000
}
```