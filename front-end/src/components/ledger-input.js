import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import { Formik } from "formik";
import React, { useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { DateRange } from "react-date-range";
import * as yup from "yup";
var { DateTime } = require('luxon');

const reqdFieldMsg = "This is a required field";
const schema = yup.object({
  category: yup.string().required(reqdFieldMsg),
  description: yup.string().required(reqdFieldMsg),
  amount: yup.number().required(reqdFieldMsg),
});

const LedgerInput = ({ show, onHide }) => {
  const serverUrl = process.env.REACT_APP_SERVER_URL;
  const { getAccessTokenSilently } = useAuth0();

  const onSubmit = async (values) => {
    const token = await getAccessTokenSilently();

    const startDate = DateTime.fromJSDate(range[0].startDate)
    const endDate = DateTime.fromJSDate(range[0].endDate)

    const startAsMillis = DateTime.fromISO(startDate).toMillis()
    const endAsMillis = DateTime.fromISO(endDate).toMillis()

    const body = {
      query: `
        mutation addLedger($accountID: Int!, $memberID: Int!, $categoryID: Int!, $amount: Float!, $isBudget: Boolean!, $description: String, $ledgerFrom: Date!, $ledgerTo: Date!) {
          addLedger(accountID: $accountID, memberID: $memberID, categoryID: $categoryID, amount: $amount, isBudget: $isBudget, description: $description, ledgerFrom: $ledgerFrom, ledgerTo: $ledgerTo) {
              ledgerID
              accountID
              memberID
              categoryID
              amount
              isBudget
              description
              ledgerFrom
              ledgerTo
          }
        }
      `,
      variables: {
        "accountID": 1,
        "memberID": 1,
        "categoryID": 1,
        "amount": parseFloat(values.amount),
        "isBudget": false,
        "description": `${values.description}`,
        "ledgerFrom": startAsMillis,
        "ledgerTo": endAsMillis
    }
    }

    await axios.post(`${serverUrl}/api/graphql`, body, {
      headers: {
        Authorization: 'Bearer ' + token
      }
     })
      .then(res => {
       console.log(res.data);
      })
      .catch(err => {
       console.log(err.message);
      });
  };
  const [range, setRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  return (
      <Modal show={show} onHide={onHide}>
        <Modal.Header closeButton>
          <Modal.Title>
            Add a new ledger item!{" "}
            <span role="img" aria-label="party">
              🎉
            </span>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Formik
            validationSchema={schema}
            onSubmit={onSubmit}
            validateOnChange={false}
            initialValues={{
              category: "1",
              description: "",
              amount: "",
            }}
          >
            {({ handleSubmit, handleChange, values, touched, errors }) => {
              return (
                <Form id="ledgerInput" noValidate onSubmit={handleSubmit}>
                  <Form.Group controlId="ledgerFormCategory">
                    <Form.Label>Category</Form.Label>
                    <Form.Control
                      as="select"
                      name="category"
                      value={values.category}
                      onChange={handleChange}
                      isInvalid={errors.category}
                    >
                      <option>1</option>
                      <option>2</option>
                      <option>3</option>
                      <option>4</option>
                      <option>5</option>
                    </Form.Control>
                    <Form.Control.Feedback type="invalid">
                      {errors.category}
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group controlId="ledgerFormDescription">
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                      type="text"
                      name="description"
                      placeholder="Please enter a description"
                      value={values.description}
                      onChange={handleChange}
                      isInvalid={errors.description}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.description}
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group controlId="ledgerFormAmount">
                    <Form.Label>Amount</Form.Label>
                    <Form.Control
                      type="text"
                      name="amount"
                      placeholder="Please enter an amount"
                      value={values.amount}
                      onChange={handleChange}
                      isInvalid={errors.amount}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.amount}
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group>
                    <Form.Label>Date</Form.Label>
                    <div className="date-range-container">
                      <DateRange
                        editableDateInputs={true}
                        moveRangeOnFirstSelection={false}
                        ranges={range}
                        onChange={item => setRange([item.selection])}
                      />
                    </div>
                  </Form.Group>
                </Form>
              );
            }}
          </Formik>
        </Modal.Body>
        <Modal.Footer>
          <Button type="submit" form="ledgerInput" >
            Add Item
          </Button>
        </Modal.Footer>
      </Modal>
  );
};

export default LedgerInput;
