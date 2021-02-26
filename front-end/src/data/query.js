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
        yearlyLedgersByMonth: sumLedgerRangeByMetric(from: $from, to: $to, type:[INCOME, EXPENSE], metric: MONTHLY) {
            from
            to
            count
            incomes
            expenses
        }
        yearlyExpenseByCategory: sumLedgerRangeCategoryByMetric(from: $from, to: $to, type:[EXPENSE], metric: YEARLY) {
            from
            to
            count
            categories {
                category {
                    categoryName
                }
                incomes
                expenses
            }
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
    const from = new Date(Date.UTC(year, 0, 1));
    const to = new Date(Date.UTC(year, 11, 31, 23, 59, 59));
    return (await client.request(meGQL, { from: from.getTime(), to: to.getTime() }, { authorization })).me;
  } catch (err) {
    console.log(err);
    return "Error fetching data";
  }
}

export { 
  queryMe,
};