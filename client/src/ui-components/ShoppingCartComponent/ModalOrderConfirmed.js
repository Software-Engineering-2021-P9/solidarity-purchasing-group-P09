import "bootstrap/dist/css/bootstrap.min.css";
import "./ShoppingCartControlsCSS.css";
import React from "react";
import { Button, Modal } from "react-bootstrap";

function ModalOrderConfirmed(props) {

  return (
    <Modal show={props.show} onHide={props.handleClose}>
      <Modal.Header closeButton>
        <Modal.Title className="modal-title">Are you sure?</Modal.Title>
      </Modal.Header>
      <ul>
        <li>Output map to send to createOrder:</li>
        {Array.from(props.cart.entries()).map((entry) => {
          return (
            <li>
              {entry[0]}
              {"->"}
              {entry[1]}
            </li>
          );
        })}
      </ul>
      <Modal.Footer>
        <Button onClick={props.handleClose} className="cart-inverse-button">
          Close
        </Button>
        <Button onClick={props.handleSubmit} className="cart-button">
          Send the order
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export { ModalOrderConfirmed };
