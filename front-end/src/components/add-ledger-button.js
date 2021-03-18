import React, { useState } from "react";
import { Button } from "react-bootstrap";
import LedgerInput from "./ledger-input";

const AddLedgerButton = () => {
  const [showModal, setShowModal] = useState(false);
  const handleClick = () => {
    setShowModal(true);
  };

  return (
    <>
      <Button variant="primary" onClick={handleClick}>Add Item</Button>
      <LedgerInput
        show={showModal}
        onHide={() => setShowModal(false)}
      />
    </>
  );
};

export default AddLedgerButton;
