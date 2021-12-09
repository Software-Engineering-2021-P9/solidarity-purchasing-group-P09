import "bootstrap/dist/css/bootstrap.min.css";
import "./ShoppingCartSummaryCSS.css";
import React from "react";
import Button from "../Button/Button";
import { Container, Row, Col } from "react-bootstrap";

function ShoppingCartSummary(props) {
  return (
    <Container className="summary-container py-4 px-4 my-ml">
      <Row>
        <OrderSummary
          products={props.products}
          cart={props.cart}
          tot={props.tot}
        />
      </Row>
      <Row className="my-5">FORM SHIPMENT/PICKUP</Row>
      <Row className="d-flex justify-content-center">
        <Button
          className="w-auto"
          disabled={props.cart.size === 0}
          onClick={props.handleShow}
        >
          PLACE ORDER
        </Button>
      </Row>
    </Container>
  );
}

function OrderSummary(props) {
  return (
    <Container>
      <Row className="order-summary-title mb-3">ORDER SUMMARY</Row>
      {props.products.map((item) => {
        return (
          <Row className="d-flex justify-content-between">
            <Col md="1" sm="1" xs="1">
              {props.cart.get(item.id)}
            </Col>
            <Col md="6" sm="6" xs="6">
              {"x "} {item.name}
            </Col>
            <Col className="align-end">
              {item.price * props.cart.get(item.id).toFixed(2)}
              {" €"}
            </Col>
          </Row>
        );
      })}
      <Row className="total-row mt-2">
        <Col>TOTAL</Col>
        <Col className="align-end">
          <b>
            {props.tot}
            {" €"}
          </b>
        </Col>
      </Row>
    </Container>
  );
}

export { ShoppingCartSummary };
