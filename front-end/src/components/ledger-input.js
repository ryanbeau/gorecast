import { Formik } from "formik";
import React, { useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { DateRange } from "react-date-range";
import * as yup from "yup";
import Success from "./success";
var { DateTime } = require("luxon");
const { mutationAddLedger } = require("../data");

const requiredMessage = "This is a required field";
const schema = yup.object({
  category: yup.string().required(requiredMessage),
  description: yup.string().required(requiredMessage),
  amount: yup.number().required(requiredMessage),
});

const LedgerInput = ({ me, token, accountID, onUpdate }) => {
  const [show, setShow] = useState(false);
  const showModal = () => {
    setShow(true);
  };

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const onSubmit = (values) => {
    const startDate = DateTime.fromJSDate(range[0].startDate).toMillis();
    const endDate = DateTime.fromJSDate(range[0].endDate).toMillis();

    mutationAddLedger(
      `Bearer ${token}`,
      accountID,
      parseInt(values.category),
      parseFloat(values.amount),
      values.isBudget,
      `${values.description}`,
      startDate,
      endDate
    )
      .then((result) => {
        // TODO: refresh Account (query Me)
      })
      .catch((err) => {
        console.log(err.message);
      });
    handleClose();
    onUpdate();
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
      <Button variant="primary" onClick={handleShow}>
        Add Ledger Item
      </Button>
      
      <Success show={show} onHide={() => setShow(false)} />
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add Ledger Item</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Formik
            validationSchema={schema}
            onSubmit={onSubmit}
            validateOnChange={false}
            initialValues={{
              category: 1,
              description: "",
              amount: "",
              isBudget: false,
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
                  <Form.Group controlId="formBasicCheckbox">
                    <Form.Check
                      type="checkbox"
                      name="isBudget"
                      value={values.isBudget}
                      onChange={handleChange}
                      label="This is a budget"
                    />
                  </Form.Group>
                </Form>
              );
            }}
          </Formik>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button type="submit" form="ledgerInput">
            Submit
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default LedgerInput;
