import "bootstrap/dist/css/bootstrap.min.css";
import "./ShoppingCartTableCSS.css";
import React from "react";
import { Container, Col, Row} from "react-bootstrap";
import ImageService from "../../services/ImageService/ImageService";

function ShoppingCartTable(props) {

  return (
    <Container>
      <Col>
        <Row className="table-heading p-2 mb-3">
          <Col md={1}>Category</Col>
          <Col md={2} className="my-pl-3">Item</Col>
          <Col md={4} className="my-pl-3">Description</Col>
          <Col md={2}>Packaging</Col>
          <Col md={1}>Price</Col>
          <Col md={1}>Quantity</Col>
          <Col md={1}>Total</Col>
        </Row>
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
      <Col md={1} >
        <img
          alt=""
          width="100"
          src={ImageService.returnImageByCategory(props.product.category)}
        />
      </Col>
      <Col className="item-cart my-pl-3" md={2}>{props.product.name}</Col>
      <Col md={4} className="my-pl-3">{props.product.description}</Col>
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
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            class="bi bi-dash-square"
            viewBox="0 0 16 16"
          >
            <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z" />
            <path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8z" />
          </svg>
        </span>
        <span className="mx-2">{props.quantity}</span>
        <span
          onClick={() => {
            props.updateQuantity(props.product.id, 1, props.product.price);
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            class="bi bi-plus-square"
            viewBox="0 0 16 16"
          >
            <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z" />
            <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
          </svg>
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
