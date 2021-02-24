import { GraphQLClient, gql } from 'graphql-request'

const client = new GraphQLClient(`${process.env.REACT_APP_SERVER_URL}/api/graphql`)

const queryMe = gql`
  query Me($year: Int!) {
    me {
      memberID
      email
      memberName
      accounts {
        accountID
        startBalance
        incomeByYear(year: $year, metric: MONTHLY)
        expensesByYear(year: $year, metric: MONTHLY)
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

async function getMe(authorization) {
  try {
    console.log(authorization);
    return (await client.request(queryMe, { year: new Date().getFullYear() }, { authorization })).me;
  } catch (err) {
    console.log(err);
    return "Error fetching data";
  }
}

export { 
  getMe,
};