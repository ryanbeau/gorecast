import { Formik } from "formik";
import React, { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { DateRange } from "react-date-range";
import * as yup from "yup";
import Success from "./success";
var { DateTime } = require("luxon");
const { mutationAddLedger } = require("../data");

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

  const onSubmit = (values) => {
    const startDate = DateTime.fromJSDate(range[0].startDate).toMillis();
    const endDate = DateTime.fromJSDate(range[0].endDate).toMillis();

    mutationAddLedger(`Bearer ${token}`, accountID, parseInt(values.category), parseFloat(values.amount), false, `${values.description}`, startDate, endDate)
      .then((result) => {
        // TODO: refresh Account (query Me)
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
