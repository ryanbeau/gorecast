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
        oneMonthLedgersByWeek: sumLedgerRangeByMetric(from: $oneMonthFrom, to: $oneMonthTo, type:[INCOME, EXPENSE], metric: WEEKLY) {
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
          category {
            categoryName
          }
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

const categoryGQL = gql`
  query Category($categoryName: String!, $ledgerRangeFrom: Date!, $ledgerRangeTo: Date!) {
    categoryByName(categoryName: $categoryName) {
      categoryID
      categoryName
      ledgers {
        ledgerID
        accountID
        categoryID
        amount
        isBudget
        description
        ledgerFrom
        ledgerTo
        account {
          accountID
          accountName
          startBalance
        }
      }
      sumLedgerRangeByMetric(from: $ledgerRangeFrom, to: $ledgerRangeTo, type:[INCOME, EXPENSE], metric: DAILY) {
        from
        to
        metric
        count
        incomes
        expenses
      }
    }
  }`

const categoriesGQL = gql`
  query Categories {
    categories {
      categoryID
      categoryName
      ledgers {
        ledgerID
        accountID
        categoryID
        amount
        isBudget
        description
        ledgerFrom
        ledgerTo
        account {
          accountID
          accountName
          startBalance
        }
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

async function queryCategories(authorization) {
  try {
    const result = await client.request(categoriesGQL, {}, { authorization });
    return result.categories;
  } catch (err) {
    console.log(err);
    throw new Error(err.message);
  }
}

async function queryCategory(authorization, categoryName, from, to) {
  console.log(`queryCategory: ${categoryName} ${from} ${to}`)
  const now = DateTime.utc();

  // default: from 1 month ago to now
  if (!to) to = now.endOf('day');
  if (!from) from = now.minus({ months: 1 }).startOf('day');

  try {
    const result = await client.request(categoryGQL, {
      categoryName,
      ledgerRangeFrom: from.valueOf(),
      ledgerRangeTo: to.valueOf(),
    }, { authorization });
    return result.categoryByName;
  } catch (err) {
    console.log(err);
    throw new Error(err.message);
  }
}

export {
  queryMe,
  queryCategory,
  queryCategories,
}