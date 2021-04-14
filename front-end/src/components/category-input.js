import { Formik } from "formik";
import React, { useState } from "react";
import { Button, Form } from "react-bootstrap";
import * as yup from "yup";
import Success from "./success";
const { mutationAddCategory } = require("../data");

const reqdFieldMsg = "This is a required field";
const schema = yup.object({
  name: yup.string().required(reqdFieldMsg),
});

const CategoryInput = ({ memberID, token }) => {
  const [show, setShow] = useState(false);
  const showModal = () => {
    setShow(true);
  };

  const onSubmit = (values) => {

    mutationAddCategory(`Bearer ${token}`, values.name)
      .then((result) => {
        // TODO: refresh Profile (query Me)
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
