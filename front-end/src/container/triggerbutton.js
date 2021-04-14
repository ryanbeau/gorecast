import React from 'react';
const Trigger = ({ triggerText, buttonRef, showModal }) => {
  return (
    <button
      style={{ padding: '5px 6px', margin: '0px 6px' }}
      className="btn btn-lg btn-danger center modal-button"
      ref={buttonRef}
      onClick={showModal}
    >
      {triggerText}
    </button>
  );
};
export default Trigger;
