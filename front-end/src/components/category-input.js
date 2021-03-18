import axios from "axios";
import { Formik } from "formik";
import React, { useState } from "react";
import { Button, Form } from "react-bootstrap";
import * as yup from "yup";
import Success from "./success";

const reqdFieldMsg = "This is a required field";
const schema = yup.object({
  name: yup.string().required(reqdFieldMsg),
});

const CategoryInput = ({ memberID, token }) => {
  const serverUrl = process.env.REACT_APP_SERVER_URL;
  const [show, setShow] = useState(false);
  const showModal = () => {
    setShow(true);
  };

  const onSubmit = (values) => {
    const body = {
      query: `
        mutation addCategory($memberID: Int!, $categoryName: String!) {
            addCategory(memberID: $memberID, categoryName: $categoryName) {
                categoryID
                memberID
                categoryName
            }
        }
      `,
      variables: {
        memberID: memberID,
        categoryName: `${values.name}`,
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

  return (
    <>
      <Success show={show} onHide={() => setShow(false)} />
      <Formik
        validationSchema={schema}
        onSubmit={onSubmit}
        validateOnChange={false}
        initialValues={{
          name: "",
        }}
      >
        {({ handleSubmit, handleChange, values, errors }) => {
          return (
            <Form id="categoryInput" noValidate onSubmit={handleSubmit}>
              <Form.Group controlId="categoryFormDescription">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  placeholder="Please enter a category name"
                  value={values.name}
                  onChange={handleChange}
                  isInvalid={errors.name}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.name}
                </Form.Control.Feedback>
              </Form.Group>
              <Button type="submit" form="categoryInput">
                Add Item
              </Button>
            </Form>
          );
        }}
      </Formik>
    </>
  );
};

export default CategoryInput;
