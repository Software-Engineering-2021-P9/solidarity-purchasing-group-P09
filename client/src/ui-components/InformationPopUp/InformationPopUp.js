import React from "react";
import { Modal } from "react-bootstrap";
import Button from "../Button/Button";
import { alertIcon } from "../icons";
import { Row, Col } from "react-bootstrap";
function InformationPopUp(props) {
  return (
    <>
      <Modal show={props.show} onHide={props.handleClose} animation={false}>
        <Modal.Header closeButton>
          <Modal.Title>{props.title}</Modal.Title>
        </Modal.Header>
        {props.isWarning ? (
          <Modal.Body>
            <Row>
              <Col xs={2}> {alertIcon}</Col>
              <Col xs={10}> {props.body}</Col>
            </Row>{" "}
          </Modal.Body>
        ) : (
          <Modal.Body>{props.body}</Modal.Body>
        )}

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
