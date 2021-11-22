import "bootstrap/dist/css/bootstrap.min.css";
import "./ShoppingCartControlsCSS.css";
import React, { useState, useEffect } from "react";
import { Modal, Container, Row, Col } from "react-bootstrap";
import  Button  from "../Button/Button";


function ModalOrderConfirmation(props) {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const getProducts = () => {
      const keys = Array.from( props.cart.keys() );
      props.getProductsByIDs(keys).then(function (res) {
        setProducts(res);
      });
    };
    getProducts();
  }, [props]);

  return (
    <Modal show={props.show} onHide={props.handleClose}>
      <Modal.Header closeButton>
        <Modal.Title className="modal-title">Are you sure?</Modal.Title>
      </Modal.Header>
      <Container>
      {products.map((item) => {
          return (
            <OrderRecapRow
            product={item}
            quantity={props.cart.get(item.id)}
            key={item.id}
          />
          );
        })}
        <br />
        <Row>
          <Col xs={5}>
            Total amount: {props.tot.toFixed(2)}
            {" €"}
          </Col>
          <Col></Col>
        </Row>
      </Container>
      <Modal.Footer>
        <Button onClick={props.handleClose} className="btn-light mx-3">
          Close
        </Button>
        <Button onClick={props.handleSubmit} className="btn-primary">
          Send the order
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

function OrderRecapRow(props) {
  return (
    <Row className="d-flex justify-content-between">
      <Col>
        {props.quantity}
        {"x "} {props.product.name}
      </Col>
      <Col xs={6}></Col>
      <Col>
        {(props.product.price * props.quantity).toFixed(2)}
        {" €"};
      </Col>
    </Row>
  );
}

export { ModalOrderConfirmation };
