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
          <h3>{budget ? `${budget.description}: $ ${budget.amount.toFixed(2)}` : "Fetching..."}</h3>
          {budget && <p>Date from <i>{DateTime.fromMillis(budget.ledgerFrom).toISODate()}</i> to <i>{DateTime.fromMillis(budget.ledgerTo).toISODate()}</i></p>}
        </Col>
      </Row>
      {budget && <>
        <Row>
          <Col>
            <CategoryLedgerTable data={buildBudgetLedgersData({ 
                ledgers: budget.ledgersOverlappingByCategoryFromAccount.filter(l => budget.amount < 0 === l.amount < 0)
            })} />
          </Col>
        </Row>
      </>}
    </Container>
  );
}

export default Budget;
