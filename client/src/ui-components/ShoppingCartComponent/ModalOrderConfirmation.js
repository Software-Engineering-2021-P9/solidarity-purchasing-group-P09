import "bootstrap/dist/css/bootstrap.min.css";
import "./ModalOrderConfirmationCSS.css";
import React from "react";
import { Modal, Container, Row, Col } from "react-bootstrap";
import Button from "../Button/Button";
import { OrderRecapRow } from "./OrderRecapRow";

function ModalOrderConfirmation(props) {
  return (
    <Modal show={props.show} onHide={props.handleClose}>
      <Modal.Header closeButton>
        <Modal.Title className="modal-title">Are you sure?</Modal.Title>
      </Modal.Header>
      <Container>
        {props.products.map((item) => {
          return (
            <OrderRecapRow
              product={item}
              quantity={props.cart.get(item.id)}
              key={item.id}
            />
          );
        })}
        <Row className='d-flex justify-content-between px-2 py-1'>
            <Col>Fees</Col>
            <Col className='align-end'>{props.deliveryType==="Shipment"?"20 €":"0 €"}</Col>
        </Row>
        <br />
        <Row className="px-2 pb-2">
          <Col xs={5} className="amount">
            Total amount: {props.tot.toFixed(2)}
            {" €"}
          </Col>
          <Col></Col>
        </Row>
      </Container>
      <Modal.Footer>
        <Button onClick={props.handleSubmit}>Send the order</Button>
        <Button onClick={props.handleClose} variant="light" className="mx-3">
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export { ModalOrderConfirmation };
