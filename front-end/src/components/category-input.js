import { Formik } from "formik";
import React, { useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import * as yup from "yup";
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

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const onSubmit = (values) => {
    mutationAddCategory(`Bearer ${token}`, values.name)
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
      <Button variant="primary" onClick={handleShow}>
        Add Category
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add Category</Modal.Title>
        </Modal.Header>
        <Modal.Body>
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
                </Form>
              );
            }}
          </Formik>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button type="submit" form="categoryInput">
            Submit
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default CategoryInput;
