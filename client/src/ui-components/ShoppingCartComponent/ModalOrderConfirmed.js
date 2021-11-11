import "bootstrap/dist/css/bootstrap.min.css";
import "./ShoppingCartControlsCSS.css";
import React from "react";
import { Button, Modal } from "react-bootstrap";

function ModalOrderConfirmed(props) {
  return (
    <Modal show={props.show} onHide={props.handleClose}>
      <Modal.Header closeButton>
        <Modal.Title className="modal-title">Order Recap</Modal.Title>
      </Modal.Header>
      <ul>To be completed</ul>
      <Modal.Footer>
        <Button onClick={props.handleClose} className="cart-inverse-button">
          Close
        </Button>
        <Button onClick={props.handleClose} className="cart-button">
          Send the order
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export { ModalOrderConfirmed };
