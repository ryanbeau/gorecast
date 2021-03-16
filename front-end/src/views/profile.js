import React, { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Area, Budgets, Donut, StackedColumn } from "../charts";
import { Card, Container, Row, Col } from 'react-bootstrap';
import AddLedgerButton from "../components/add-ledger-button"
import "bootstrap/dist/css/bootstrap.min.css";
const { buildAreaChartData, buildBudgetsData, buildPieChartData, buildStackColumnData, queryMe } = require("../data");

const getInitialMe = () => {
  return {
    accounts: [],
  }
}

const Profile = () => {
  const [me, setMe] = useState(getInitialMe());
  const { user, getAccessTokenSilently } = useAuth0();
  const { name, picture, email } = user;

  useEffect(() => {
    getAccessTokenSilently()
      .then((token) => {
        queryMe(`Bearer ${token}`)
          .then(result => {
            if (result) {
              setMe(result);
            }
          })
          .catch(error => {
            // TODO: do something with this
          });
      });
  }, [user, getAccessTokenSilently])

  return (
    <Container>
      <Row className="align-items-center profile-header">
        <Col md="2" className="mb-3">
          <img
            src={picture}
            alt="Profile"
            className="rounded-circle img-fluid profile-picture mb-3 mb-md-0"
          />
        </Col>
        <Col md className="text-center text-md-left">
          <h2>{name}</h2>
          <p className="lead text-muted">{email}</p>
        </Col>
      </Row>
      {me.accounts.map((account, index) => (
        <div key={account.accountID}>
          <h3 className="overview-account-title">{account.accountName || `Account ${index + 1}`}</h3>
          <Row>
            <Col>
              <Row>
                <Col xl={6} className="d-flex mb-3">
                  <Card border="0" className="shadow-sm w-100">
                    <Area data={buildAreaChartData(account.oneMonthLedgersByWeek)} height={246} title={'Past Month'} />
                  </Card>
                </Col>
                <Col sm={6} xl={3} className="d-flex mb-3">
                  <Card border="0" className="shadow-sm w-100">
                    <Donut data={buildPieChartData(account.currentYearExpenseByCategory)} height={246} labelTotal={`Expense Total`} title={'Monthly Expenses'} />
                  </Card>
                </Col>
                <Col sm={6} xl={3} className="d-flex mb-3">
                  <Card border="0" className="shadow-sm w-100">
                    <Budgets data={buildBudgetsData(account.sumBudgetsProgress)} width={247} height={246} />
                  </Card>
                </Col>
              </Row>
              <Row>
                <Col className="mb-3">
                  <Card border="0" className="shadow-sm">
                    <StackedColumn data={buildStackColumnData(account.currentYearLedgersByMonth)} height={350} title={`Income and Expenses ${new Date().getFullYear()}`} />
                  </Card>
                </Col>
              </Row>
            </Col>
          </Row>
        </div>
      ))}
      <Row>
        <Col className="mb-3" md="12">
          <AddLedgerButton />
        </Col>
      </Row>
      <Row>
        <Col md="12">
          <pre className="text-light bg-dark p-4">
            {JSON.stringify(user, null, 2)}
          </pre>
        </Col>
      </Row>
      <Row>
        <Col md="12">
          <pre className="text-light bg-dark p-4">
            {JSON.stringify(me, null, 2)}
          </pre>
        </Col>
      </Row>
    </Container>
  );
};

export default Profile;
