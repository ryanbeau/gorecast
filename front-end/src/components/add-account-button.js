import React, { useState } from "react";
import { Button } from "react-bootstrap";
import AccountInput from "./account-input";

const AddAccountButton = () => {
    const [showModal, setShowModal] = useState(false);
    const handleClick = () => {
        setShowModal(true);
    };

    return (
        <>
            <Button variant="primary" onClick={handleClick}>Add Account</Button>
            <AccountInput
                show={showModal}
                onHide={() => setShowModal(false)}
            />
        </>
    );
};

export default AddAccountButton;