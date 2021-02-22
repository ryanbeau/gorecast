import { GraphQLClient, gql } from 'graphql-request'

const client = new GraphQLClient(`${process.env.REACT_APP_SERVER_URL}/api/graphql`)

const queryMe = gql`
  {
    me {
      memberID
      email
      memberName
      accounts {
        accountID
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
        isBudget
        description
        ledgerFrom
        ledgerTo
      }
    }
  }`

async function getMe(authorization) {
  try {
    const member = await client.request(queryMe, {}, { authorization });
    return member.me;
  } catch (err) {
    console.log(err);
    return "Error fetching data";
  }
}

export { 
  getMe,
};