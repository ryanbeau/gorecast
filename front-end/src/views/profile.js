import React, { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Area, Donut, StackedColumn } from "../charts";
import { Card, Container, Row, Col } from 'react-bootstrap';
import "bootstrap/dist/css/bootstrap.min.css";
const { buildAreaChartData, buildPieChartData, buildStackColumnData, queryMe } = require("../data");

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
              console.warn(result);
              setMe(result);
            }
          })
          .catch(error => {
            // TODO : do something with this
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
        <Row key={index}>
          <Col>
            <Row className="mb-3">
              <Col md="auto" className="d-flex">
                <Card border="0" className="shadow-sm align-self-stretch">
                  <Area data={buildAreaChartData(account.oneMonthLedgersByDay)} width={380} height={246} title={'Past Month'} />
                </Card>
              </Col>
              <Col md="auto" className="d-flex">
                <Card border="0" className="shadow-sm align-self-stretch">
                  <Donut data={buildPieChartData(account.currentYearExpenseByCategory)} width={380} height={246} title={'Monthly Expenses'} />
                </Card>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col>
                <Card border="0"  className="shadow-sm">
                  <StackedColumn data={buildStackColumnData(account.currentYearLedgersByMonth)} height={350} title={`Income vs Expense ${new Date().getFullYear()}`} />
                </Card>
              </Col>
            </Row>
          </Col>
        </Row>
      ))}
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
