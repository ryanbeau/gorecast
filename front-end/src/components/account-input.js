import React, { useEffect, useState } from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import { Formik } from "formik";
import { Button, Form } from "react-bootstrap";
import * as yup from "yup";
import Success from "./success";
const { queryMe } = require("../data");


const reqdFieldMsg = "This is a required field";
const schema = yup.object({
  accountName: yup.string().required(reqdFieldMsg),
  startBalance: yup.number().required(reqdFieldMsg),
});

const getInitialMe = () => {
  return {
    accounts: [],
  }
}

const AccountInput = () => {
  const [show, setShow] = useState(false);
  const showModal = () => {
    setShow(true);
  };

  const [me, setMe] = useState(getInitialMe());
  const [userJWT, setUserJWT] = useState();
  const { user, getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    getAccessTokenSilently()
      .then((token) => {
        queryMe(`Bearer ${token}`)
          .then(result => {
            if (result) {
              setMe(result);
              setUserJWT(token);
            }
          })
          .catch(error => {
            // TODO: do something with this
          });
      });
  }, [user, getAccessTokenSilently])

  const serverUrl = process.env.REACT_APP_SERVER_URL;

  const onSubmit = (values) => {

    const body = {
      query: `
        mutation addAccount($memberID: Int!, $accountName: String!, $startBalance: Float) {
          addAccount(memberID: $memberID, accountName: $accountName, startBalance: $startBalance) {
              accountID
              memberID
              accountName
              startBalance
          }
        }
      `,
      variables: {
        memberID: me.memberID,
        accountName: `${values.accountName}`,
        startBalance: parseFloat(values.startBalance),
      },
    };

    axios
      .post(`${serverUrl}/api/graphql`, body, {
        headers: {
          Authorization: "Bearer " + userJWT,
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

/*
export const Form = ({ onSubmit }) => {
  return (
    <form onSubmit={onSubmit}>
      <div className="form-group">
        <label htmlFor="aname">Account Name</label>
        <input className="form-control" id="aname" />
      </div>
      <div className="form-group">
        <label htmlFor="sbalance">Starting Balance</label>
        <input
          type=""
          className="form-control"
          id="sbalance"
          placeholder="name@example.com"
        />
      </div>
      <div className="form-group">
        <button className="form-control btn btn-primary" type="submit">
          Submit
        </button>
      </div>
    </form>
  );
};
export default Form;
*/