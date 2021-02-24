import React, { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import Chart from 'react-apexcharts'
const { options } = require("../data/stacked-columns");
const { getMe } = require("../data/query");

const initialSeries = [
  {
    name: 'Income',
    data: [0], // empty values are required
  },
  {
    name: 'Expenses',
    data: [0], // empty values are required
  },
];

const Profile = () => {
  const [series, setSeries] = useState(initialSeries);
  const [me, setMe] = useState("Fetching...");
  const { user, getAccessTokenSilently } = useAuth0();
  const { name, picture, email } = user;

  useEffect(() => {
    console.log("useEffect1");
    getAccessTokenSilently()
      .then((token) => {
        getMe(`Bearer ${token}`)
          .then(result => {
            setMe(result);
          });
      });
  }, [])

  useEffect(() => {
    console.log("useEffect2");
    if (me && me.accounts && me.accounts.length > 0) {
      console.log("pain");
      console.log(me.accounts[0].incomeByYear);
      setSeries([
        {
          name: 'Income',
          data: me.accounts[0].incomeByYear,
        },
        {
          name: 'Expenses',
          data: me.accounts[0].expensesByYear,
        },
      ]);
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

      <div id="chart">
        <Chart options={options} series={series} type="bar" height={350} />
      </div>
    </div>
  );
};

export default Profile;
