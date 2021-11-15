import React from "react";
import { Button, Modal } from "react-bootstrap";

function PopUpForCompleteOrder(props) {
  return (
    <Modal show={props.modalIsOpen} onHide={() => props.setModalIsOpen(false)}>
      <Modal.Header closeButton onClick={() => props.setModalIsOpen(false)}>
        <Modal.Title>Are you sure?</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <p>You will change status of the order to done.</p>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={() => props.setModalIsOpen(false)}>
          Cancel
        </Button>
        <Button variant="primary" onClick={props.handleSubmit}>
          Submit
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export { PopUpForCompleteOrder };
