import React, { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Area } from "../charts";
import CategoryLedgerTable from "../components/category-ledger-table"
import { Card, Container, Row, Col } from 'react-bootstrap';
const { buildAreaChartData, buildCategoryLedgersData, queryCategory } = require("../data");

const Category = (props) => {
  const [category, setCategory] = useState();
  const { getAccessTokenSilently } = useAuth0();
  const categoryName = props.match.params.category;

  useEffect(() => {
    getAccessTokenSilently()
      .then((token) => {
        queryCategory(`Bearer ${token}`, categoryName)
          .then(result => {
            setCategory(result);
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
          <h3>{categoryName}</h3>
        </Col>
      </Row>
      {category && <>
        <Row>
          <Col>
            <Card border="0" className="shadow-sm w-100">
              <Area data={buildAreaChartData(category.sumLedgerRangeByMetric)} height={246} title={'Past Month'} />
            </Card>
          </Col>
        </Row>
        <Row>
          <Col>
            <CategoryLedgerTable data={buildCategoryLedgersData(category)} />
          </Col>
        </Row>
      </>}
    </Container>
  );
}

export default Category;
