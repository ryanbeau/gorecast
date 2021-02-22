# Gorecast

This repository contains a React front-end and a node.js back-end that defines an Express API. Follow the instructions below to run the client and server.

## Requirements

* Node ([download]("https://nodejs.org/en/"))

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

# MySQL Database

The default database `gorecase` uses the following default connection values:
```bash
DB_PORT=3306
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=root
```
If these default values require change for local deployment, add them to the `.env` file with required values.

# GraphQL

### GET: Me
```graphql
{
    me {
        memberID
        email
        memberName
        accounts {
            accountID
            accountName
            startBalance
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
            description
            ledgerFrom
            ledgerTo
        }
    }
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
    "categoryName": "Salary",
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
mutation addLedger($accountID: Int!, $memberID: Int!, $categoryID: Int!, $amount: Float!, $description: String, $ledgerFrom: String!, $ledgerTo: String!) {
    addLedger(accountID: $accountID, memberID: $memberID, categoryID: $categoryID, amount: $amount, description: $description, ledgerFrom: $ledgerFrom, ledgerTo: $ledgerTo) {
        ledgerID
        accountID
        memberID
        categoryID
        amount
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
    "memberID": 1,
    "categoryID": 1,
    "amount": 123.45,
    "description": "McDonald's",
    "ledgerFrom": "2012-04-23T18:25:43.511Z",
    "ledgerTo": "2012-04-23T18:25:43.511Z"
}
```