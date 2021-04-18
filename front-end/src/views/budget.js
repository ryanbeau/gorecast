import React, { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Area } from "../charts";
import CategoryLedgerTable from "../components/category-ledger-table"
import { Card, Container, Row, Col } from 'react-bootstrap';
var { DateTime } = require('luxon');
const { buildAreaChartData, buildBudgetLedgersData, queryBudget } = require("../data");

const Budget = (props) => {
  const [budget, setBudget] = useState();
  const { getAccessTokenSilently } = useAuth0();
  const budgetId = parseInt(props.match.params.budgetId);

  useEffect(() => {
    getAccessTokenSilently()
      .then((token) => {
        queryBudget(`Bearer ${token}`, budgetId)
          .then(result => {
            setBudget(result);
          })
          .catch(error => {
            // TODO: do something with this
          });
      });
  }, [getAccessTokenSilently])

  return (
    <Container style={{ 
      maxWidth: "1200px",
      backgroundColor: "#f4f5f9",
      margin: "auto",
      padding: "10px"
      }}>
      <Row>
        <Col>
          <h3>{budget ? budget.description : "Fetching..."}</h3>
          {budget && <p>{`${DateTime.fromMillis(budget.ledgerFrom).toISODate()} to ${DateTime.fromMillis(budget.ledgerTo).toISODate()}`}</p>}
        </Col>
      </Row>
      {budget && <>
        {/* <Row>
          <Col>
            <Card border="0" className="shadow-sm w-100">
              <Area data={buildAreaChartData(category.sumLedgerRangeByMetric)} height={246} title={'Past Month'} />
            </Card>
          </Col>
        </Row> */}
        <Row>
          <Col>
            <CategoryLedgerTable data={buildBudgetLedgersData({ ledgers: budget.ledgersOverlappingByCategoryFromAccount })} />
          </Col>
        </Row>
      </>}
    </Container>
  );
}

export default Budget;
