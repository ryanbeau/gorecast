import React, { useEffect, useState } from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import { Formik } from "formik";
import { Button, Form } from "react-bootstrap";
import * as yup from "yup";
import Success from "./success";
const { mutationAddAccount } = require("../data");


const reqdFieldMsg = "This is a required field";
const schema = yup.object({
  accountName: yup.string().required(reqdFieldMsg),
  startBalance: yup.number().required(reqdFieldMsg),
});

const AccountInput = () => {
  const [show, setShow] = useState(false);
  const showModal = () => {
    setShow(true);
  };
  const [userJWT, setUserJWT] = useState();
  const { user, getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    getAccessTokenSilently()
      .then((token) => {
        setUserJWT(token);
      });
  }, [user, getAccessTokenSilently])

  const onSubmit = (values) => {

    mutationAddAccount(`Bearer ${userJWT}`, values.accountName, parseFloat(values.startBalance))
      .then((result) => {
        // TODO: refresh Account (query Me)
      })
      .catch((err) => {
        console.log(err.message);
      });

    showModal();
  };

  return (
    <>
      <Success show={show} onHide={() => setShow(false)} />
      <Formik
        validationSchema={schema}
        onSubmit={onSubmit}
        validateOnChange={false}
        initialValues={{
          startBalance: "0.00",
        }}
      >
        {({ handleSubmit, handleChange, values, errors }) => {
          return (
            <Form id="accountInput" noValidate onSubmit={handleSubmit}>
              <Form.Group controlId="accountFormName">
                <Form.Label>Account Name</Form.Label>
                <Form.Control
                  type="text"
                  name="accountName"
                  placeholder="Please enter an account name"
                  value={values.accountName}
                  onChange={handleChange}
                  isInvalid={errors.accountName}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.accountName}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group controlId="accountFormAmount">
                <Form.Label>Starting Account Balance</Form.Label>
                <Form.Control
                  type="text"
                  name="startBalance"
                  placeholder="Please enter an initial amount"
                  value={values.startBalance}
                  onChange={handleChange}
                  isInvalid={errors.startBalance}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.startBalance}
                </Form.Control.Feedback>
              </Form.Group>
              <Button type="submit" form="accountInput">
                Add Account
              </Button>
            </Form>
          );
        }}
      </Formik>
    </>
  );
};

export default AccountInput;
