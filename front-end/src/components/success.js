import React from "react";
import { Button, Modal } from "react-bootstrap";

const Success = ({show, onHide}) => {
 
    return (
      <>  
        <Modal show={show} onHide={onHide}>
          <Modal.Header closeButton>
            <Modal.Title>Success!</Modal.Title>
          </Modal.Header>
          <Modal.Body>Woohoo, you've successfully added a thing!</Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={onHide}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }

  export default Success;