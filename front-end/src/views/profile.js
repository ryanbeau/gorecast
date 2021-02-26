import React, { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Donut } from "../charts/donut"
import { StackedColumn } from "../charts/stacked-column";
const { queryMe } = require("../data/query");

const initialSeries = {
  yearlyExpenseIncome: [
    {
      name: 'Income',
      data: [0], // empty values are required
    },
    {
      name: 'Expenses',
      data: [0], // empty values are required
    },
  ],
  categoryExpense: [],
};

const initialLabels = {
  monthlyLabels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  categoryExpenses: [],
}

const Profile = () => {
  const [series, setSeries] = useState(initialSeries);
  const [labels, setLabels] = useState(initialLabels);
  const [me, setMe] = useState("Fetching...");
  const { user, getAccessTokenSilently } = useAuth0();
  const { name, picture, email } = user;

  useEffect(() => {
    getAccessTokenSilently()
      .then((token) => {
        queryMe(`Bearer ${token}`)
          .then(result => {
            setMe(result);
          });
      });
  }, [user])

  useEffect(() => {
    // build labels and series
    if (me && me.accounts && me.accounts.length > 0) {
      initialLabels.categoryExpenses = [];
      let newCategoryExpense = [];
      for (let i = 0; i < me.accounts[0].yearlyExpenseByCategory.length; i++) {
        initialLabels.categoryExpenses.push(me.accounts[0].yearlyExpenseByCategory[i].categoryName);
        newCategoryExpense.push(Math.abs(me.accounts[0].yearlyExpenseByCategory[i].amount)); // donut MUST be positive
      }
      setLabels(initialLabels);
      setSeries({
        yearlyExpenseIncome: [
          {
            name: 'Income',
            data: me.accounts[0].yearlyLedgersByMonth.incomes,
          },
          {
            name: 'Expenses',
            data: me.accounts[0].yearlyLedgersByMonth.expenses,
          },
        ],
        categoryExpense: newCategoryExpense,
      });
    }
  }, [me]);

  return (
    <div>
      <div className="row align-items-center profile-header">
        <div className="col-md-2 mb-3">
          <img
            src={picture}
            alt="Profile"
            className="rounded-circle img-fluid profile-picture mb-3 mb-md-0"
          />
        </div>
        <div className="col-md text-center text-md-left">
          <h2>{name}</h2>
          <p className="lead text-muted">{email}</p>
        </div>
      </div>
      <div className="row">
        <pre className="col-12 text-light bg-dark p-4">
          {JSON.stringify(user, null, 2)}
        </pre>
      </div>
      <div className="row">
        <pre className="col-12 text-light bg-dark p-4">
          {JSON.stringify(me, null, 2)}
        </pre>
      </div>

      <StackedColumn labels={labels.monthlyLabels} series={series.yearlyExpenseIncome} height={350} title={`Income vs Expense ${new Date().getFullYear()}`} />
      <Donut labels={labels.categoryExpenses} series={series.categoryExpense} width={380} height={246} title={'Expenses by Category'} />
    </div>
  );
};

export default Profile;
