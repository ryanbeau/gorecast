import { ProgressBar } from 'react-bootstrap';
import { Row, Col, Tooltip, OverlayTrigger } from 'react-bootstrap';

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
        {data.map((budget, index) => {
          const percent = budget.currentAmount / budget.budgetAmount * 100;
          return (
            <div key={budget.ledgerID}>
              <div className="d-flex justify-content-between">
                <div className="budget-progress-title">
                  {budget.budgetDescription}
                </div>
                <div className="budget-progress-percent">
                  {budget.currentAmount}
                </div>
              </div>
              <OverlayTrigger
                placement="bottom"
                overlay={<Tooltip>{percent.toFixed(0)}% of ${Math.abs(budget.budgetAmount).toFixed(2)}</Tooltip>}>
                <ProgressBar>
                  <ProgressBar variant="success" now={percent <= 100 ? percent : 100} />
                  {percent > 100 &&
                    <ProgressBar variant="danger" now={percent - 100} />
                  }
                </ProgressBar>
              </OverlayTrigger>
            </div>
          )
        })}
      </Col>
    </Row>
  );
}

export default Budgets;