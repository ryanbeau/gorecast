import { GraphQLClient, gql } from 'graphql-request'

const client = new GraphQLClient(`${process.env.REACT_APP_SERVER_URL}/api/graphql`)

const meGQL = gql`
  query Me($from: Date!, $to: Date!) {
    me {
      memberID
      email
      memberName
      accounts {
        accountID
        startBalance
        yearlyIncomeByMonth: sumLedgerRangeByMetric(from: $from, to: $to, type:INCOME, metric: MONTHLY)
        yearlyExpenseByMonth: sumLedgerRangeByMetric(from: $from, to: $to, type:EXPENSE, metric: MONTHLY)
        yearlyExpenseByCategory: sumLedgerRangeByCategory(from: $from, to: $to, type:EXPENSE) {
          categoryName
          amount
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
      accountShares {
        accountID
      }
      categories {
        categoryID
        categoryName
      }
    }
  }`

async function queryMe(authorization) {
  try {
    console.log(authorization);
    const year = new Date().getFullYear();
    const from = new Date(year, 0, 1);
    const to = new Date(year, 11, 31, 23, 59, 59, 999);
    return (await client.request(meGQL, { from, to }, { authorization })).me;
  } catch (err) {
    console.log(err);
    return "Error fetching data";
  }
}

export { 
  queryMe,
};