import React from "react";
import { Modal } from "react-bootstrap";
import Button from "../Button/Button";
function InformationPopUp(props) {
  return (
    <>
      <Modal show={props.show} onHide={props.handleClose} animation={false}>
        <Modal.Header closeButton>
          <Modal.Title>{props.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{props.body}</Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={props.handleClose}>
            {props.buttonMessage}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default InformationPopUp;
