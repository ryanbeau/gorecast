import React, { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import CategoryLedgerTable from "../components/category-ledger-table"
import { Container, Row, Col } from 'react-bootstrap';
const { buildCategoryLedgersData, queryCategories } = require("../data");

const Category = (props) => {
  const [category, setCategory] = useState({});
  const { getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    getAccessTokenSilently()
      .then((token) => {
        queryCategories(`Bearer ${token}`)
          .then(result => {
            if (result) {
              const c = result.find(category => category.categoryName.toUpperCase() === props.match.params.category.toUpperCase());
              setCategory(c);
            }
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
          <h3>{category.categoryName}</h3>
        </Col>
      </Row>
      <Row>
        <Col>
          <CategoryLedgerTable data={buildCategoryLedgersData(category)} />
        </Col>
      </Row>
    </Container>
  );
}

export default Category;
