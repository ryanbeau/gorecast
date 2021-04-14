import { GraphQLClient, gql } from 'graphql-request'

const client = new GraphQLClient(`${process.env.REACT_APP_SERVER_URL}/api/graphql`);

const addAccountGQL = gql`
  mutation addAccount($accountName: String!, $startBalance: Float) {
    addAccount(accountName: $accountName, startBalance: $startBalance) {
        accountID
        memberID
        accountName
        startBalance
    }
  }
`;

const addCategoryGQL = gql`
  mutation addCategory($categoryName: String!) {
    addCategory(categoryName: $categoryName) {
      categoryID
      memberID
      categoryName
    }
  }
`;

const addLedgerGQL = gql`
  mutation addLedger($accountID: Int!, $categoryID: Int!, $amount: Float!, $isBudget: Boolean!, $description: String, $ledgerFrom: Date!, $ledgerTo: Date!) {
    addLedger(accountID: $accountID, categoryID: $categoryID, amount: $amount, isBudget: $isBudget, description: $description, ledgerFrom: $ledgerFrom, ledgerTo: $ledgerTo) {
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
`;

async function mutationAddAccount(authorization, accountName, startBalance) {
  console.log(`ADD ACCOUNT ${accountName}, ${startBalance ?? 0}`);
  try {
    return await client.request(addAccountGQL, {
      accountName,
      startBalance: startBalance ?? 0,
    },
      { authorization });
  } catch (err) {
    console.log(err);
    throw new Error(err.message);
  }
}

async function mutationAddCategory(authorization, categoryName) {
  console.log(`ADD CATEGORY ${categoryName}`);
  try {
    return await client.request(addCategoryGQL, {
      categoryName,
    },
      { authorization });
  } catch (err) {
    console.log(err);
    throw new Error(err.message);
  }
}

async function mutationAddLedger(authorization, accountID, categoryID, amount, isBudget, description, ledgerFrom, ledgerTo) {
  console.log(`ADD LEDGER ${accountID}, ${categoryID}, ${amount}, ${isBudget}, ${description}, ${ledgerFrom}, ${ledgerTo}`);
  try {
    return await client.request(addLedgerGQL, {
      accountID,
      categoryID,
      amount,
      isBudget,
      description,
      ledgerFrom,
      ledgerTo,
    },
      { authorization });
  } catch (err) {
    console.log(err);
    throw new Error(err.message);
  }
}

export {
  mutationAddAccount,
  mutationAddCategory,
  mutationAddLedger,
}
