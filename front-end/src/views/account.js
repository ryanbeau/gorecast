import React, { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Area, Budgets, Donut, StackedColumn } from "../charts";
import { Card, Container, Row, Col } from 'react-bootstrap';
import CategoryInput from "../components/category-input"
import LedgerInput from "../components/ledger-input"
import LedgerTable from "../components/ledger-table"
import "bootstrap/dist/css/bootstrap.min.css";
const { buildLedgersData, buildAreaChartData, buildBudgetsData, buildPieChartData, buildStackColumnData, queryMe } = require("../data");

// TODO: Update after form input

const getInitialMe = () => {
  return {
    accounts: [],
  }
}

const Account = (props) => {
  const [me, setMe] = useState(getInitialMe());
  const [userJWT, setUserJWT] = useState();
  const { user, getAccessTokenSilently } = useAuth0();
  const { name, picture, email } = user;
  const account = me.accounts.find(account => account.accountName.toUpperCase() === props.match.params.account.toUpperCase());

  const handleUpdate = () => {
    getAccessTokenSilently()
      .then((token) => {
        queryMe(`Bearer ${token}`)
          .then(result => {
            if (result) {
              setMe(result);
              setUserJWT(token);
            }
          })
          .catch(error => {
            // TODO: do something with this
          });
      });
  }

  useEffect(() => {
    handleUpdate();
  }, [user, getAccessTokenSilently])

  return (
    <Container style={{ 
      maxWidth: "1200px",
      backgroundColor: "#f4f5f9",
      margin: "auto",
      padding: "10px"
      }}>
        <h3 className="overview-account-title">{(account?.accountName ?? `Fetching...`) || `Account`}</h3>
        {account && <>
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
                <Col xl={6} className="mb-3">
                  <Card border="0" className="shadow-sm">
                    <StackedColumn data={buildStackColumnData(account.currentYearLedgersByMonth)} height={350} title={`Income and Expenses ${new Date().getFullYear()}`} />
                  </Card>
                </Col>
                <Col xl={6} className="mb-3">
                  <Card border="0" className="shadow-sm">
                    <Area data={buildAreaChartData(account.pastYearLedgersByWeek)} height={350} title={`Income and Expenses Past Year`} />
                  </Card>
                </Col>
              </Row>
            </Col>
          </Row>
          <Row>
            <Col>
              <LedgerTable data={buildLedgersData(account)} />
            </Col>
          </Row>
          <Row className="row justify-content-end">
            <Col md={{ span: 3, offset: 3 }}>
                <div className="item-inputs">
                  <CategoryInput memberID={me.memberID} token={userJWT} onUpdate={handleUpdate} />
                  <LedgerInput me={me} token={userJWT} accountID={account.accountID} onUpdate={handleUpdate} />
                </div>
            </Col>
          </Row>
        </>}
    </Container>
  );
};

export default Account;
