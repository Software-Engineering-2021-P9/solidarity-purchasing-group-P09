import "bootstrap/dist/css/bootstrap.min.css";
import "./ShoppingCartTableCSS.css";
import React from "react";
import { Container, Col, Row } from "react-bootstrap";
import ImageService from "../../services/ImageService/ImageService";
import { iconMinus, iconPlus } from "../icons";

function ShoppingCartTable(props) {
  return (
    <Container>
      <Col>
        {props.products.map((item) => {
          return (
            <CartRow
              product={item}
              quantity={props.cart.get(item.id)}
              updateQuantity={props.updateQuantity}
              key={item.id}
            ></CartRow>
          );
        })}
      </Col>
    </Container>
  );
}

function CartRow(props) {
  return (
    <Row className="shopping-cart-row">
      <Col md={1}>
        <img
          alt=""
          width="100"
          src={ImageService.returnImageByCategory(props.product.category)}
        />
      </Col>
      <Col className="item-cart my-pl-3" md={2}>
        {props.product.name}
      </Col>
      <Col md={4} className="my-pl-3">
        {props.product.description}
      </Col>
      <Col md={2}>{props.product.packaging}</Col>
      <Col md={1}>
        {props.product.price}
        {" €"}
      </Col>
      <Col md={1}>
        <span
          onClick={() => {
            props.updateQuantity(props.product.id, -1, props.product.price);
          }}
        >
          {iconMinus}
        </span>
        <span className="mx-2">{props.quantity}</span>
        <span
          onClick={() => {
            props.updateQuantity(props.product.id, 1, props.product.price);
          }}
        >
          {iconPlus}
        </span>
      </Col>
      <Col md={1}>
        {(props.product.price * props.quantity).toFixed(2)}
        {" €"}
      </Col>
    </Row>
  );
}
export { ShoppingCartTable };
