import { GraphQLClient, gql } from 'graphql-request'
var { DateTime } = require('luxon');

const client = new GraphQLClient(`${process.env.REACT_APP_SERVER_URL}/api/graphql`)

const meGQL = gql`
  query Me($oneMonthFrom: Date!, $oneMonthTo: Date!, $currentYearFrom: Date!, $currentYearTo: Date!) {
    me {
      memberID
      email
      memberName
      accounts {
        accountID
        startBalance
        oneMonthLedgersByDay: sumLedgerRangeByMetric(from: $oneMonthFrom, to: $oneMonthTo, type:[INCOME, EXPENSE], metric: DAILY) {
            from
            to
            metric
            count
            incomes
            expenses
        }
        currentYearLedgersByMonth: sumLedgerRangeByMetric(from: $currentYearFrom, to: $currentYearTo, type:[INCOME, EXPENSE], metric: MONTHLY) {
            from
            to
            metric
            count
            incomes
            expenses
        }
        currentYearExpenseByCategory: sumLedgerRangeCategoryByMetric(from: $currentYearFrom, to: $currentYearTo, type:[EXPENSE], metric: YEARLY) {
            from
            to
            metric
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

    const now = DateTime.utc();

    const oneMonthTo = now.endOf('day');
    const oneMonthFrom = oneMonthTo.minus({ months: 1 }).startOf('day');

    const currentYearFrom = now.startOf('year');
    const currentYearTo = now.endOf('year');

    return (await client.request(meGQL, { 
      oneMonthFrom: oneMonthFrom.valueOf(),
      oneMonthTo: oneMonthTo.valueOf(),
      currentYearFrom: currentYearFrom.valueOf(), 
      currentYearTo: currentYearTo.valueOf(),
    }, { authorization })).me;
  } catch (err) {
    console.log(err);
    throw new Error(err.message);
  }
}

export default queryMe;