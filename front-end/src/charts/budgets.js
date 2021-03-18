import { ProgressBar } from 'react-bootstrap';
import { Row, Col } from 'react-bootstrap';

const Budgets = ({ data, width, height }) => {

  const divStyle = {
    minHeight: height ? (typeof height == 'string' ? height : `${height}px`) : null,
    minWidth: width ? (typeof width == 'string' ? width : `${width}px`) : null,
    padding: 10,
  };

  return (
    <Row className="content-wrapper pt-0" style={divStyle}>
      <Col>
        <div className="card-title-text">Budgets</div>
        {data.map((budget, index) => (
          <div key={budget.ledgerID}>
            <div className="d-flex justify-content-between">
              <div className="budget-progress-title">
                {budget.budgetDescription}
            </div>
              <div className="budget-progress-percent">
              {budget.currentAmount}
            </div>
            </div>
            <ProgressBar now={budget.currentAmount / budget.budgetAmount * 100} />
          </div>
        ))}
      </Col>
    </Row>
  );
}

export default Budgets;