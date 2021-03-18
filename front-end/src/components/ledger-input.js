import axios from "axios";
import { Formik } from "formik";
import React, { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { DateRange } from "react-date-range";
import * as yup from "yup";
import Success from "./success";
var { DateTime } = require("luxon");

const reqdFieldMsg = "This is a required field";
const schema = yup.object({
  category: yup.string().required(reqdFieldMsg),
  description: yup.string().required(reqdFieldMsg),
  amount: yup.number().required(reqdFieldMsg),
});

const LedgerInput = ({me, token, accountID}) => {
  const [show, setShow] = useState(false);
  const showModal = () => {
    setShow(true);
  };

  const serverUrl = process.env.REACT_APP_SERVER_URL;

  const onSubmit = (values) => {
    const startDate = DateTime.fromJSDate(range[0].startDate);
    const endDate = DateTime.fromJSDate(range[0].endDate);

    const startAsMillis = DateTime.fromISO(startDate).toMillis();
    const endAsMillis = DateTime.fromISO(endDate).toMillis();

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
        accountID: accountID,
        memberID: me.memberID,
        categoryID: parseInt(values.category),
        amount: parseFloat(values.amount),
        isBudget: false,
        description: `${values.description}`,
        ledgerFrom: startAsMillis,
        ledgerTo: endAsMillis,
      },
    };

    axios
      .post(`${serverUrl}/api/graphql`, body, {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err.message);
      });

    showModal();
  };
  const [range, setRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  return (
    <>
      <Success show={show} onHide={() => setShow(false)} />
      <Formik
        validationSchema={schema}
        onSubmit={onSubmit}
        validateOnChange={false}
        initialValues={{
          category: 1,
          description: "",
          amount: "",
        }}
      >
        {({ handleSubmit, handleChange, values, errors }) => {
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
                  {me?.categories?.map((category, index) => (
                    <option value={category.categoryID} key={index}>
                      {category.categoryName}
                    </option>
                  ))}
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
                    onChange={(item) => setRange([item.selection])}
                  />
                </div>
              </Form.Group>
              <Button type="submit" form="ledgerInput">
                Add Item
              </Button>
            </Form>
          );
        }}
      </Formik>
    </>
  );
};

export default LedgerInput;
