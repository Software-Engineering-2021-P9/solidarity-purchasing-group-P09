import "bootstrap/dist/css/bootstrap.min.css";
import "./ShoppingCartControlsCSS.css";
import React, { useState, useEffect } from "react";
import { Button, Modal } from "react-bootstrap";
import { Container, Row, Col } from "react-bootstrap";

function ModalOrderConfirmation(props) {
  return (
    <Modal show={props.show} onHide={props.handleClose}>
      <Modal.Header closeButton>
        <Modal.Title className="modal-title">Are you sure?</Modal.Title>
      </Modal.Header>
      <Container>
        {Array.from(props.cart.entries()).map((entry) => {
          const [key, val] = entry;
          return (
            <OrderRecapRow
              getProductById={props.getProductById}
              productId={key}
              quantity={val}
            />
          );
        })}
      </Container>
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

function OrderRecapRow(props) {
  const [product, setProduct] = useState({});
  useEffect(() => {
    const getProduct = () => {
      props.getProductById(props.productId).then(function (res) {
        setProduct(res);
      });
    };
    getProduct();
  }, [props]);

  return (
    <Row className="d-flex justify-content-between">
      <Col>
        {props.quantity}
        {"x "} {product.name}
      </Col>
      <Col xs={6}></Col>
      <Col>
        {(product.price * props.quantity).toFixed(2)}
        {" €"};
      </Col>
    </Row>
  );
}

export { ModalOrderConfirmation };
