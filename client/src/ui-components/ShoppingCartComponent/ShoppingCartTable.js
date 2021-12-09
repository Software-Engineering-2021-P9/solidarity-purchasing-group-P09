import "bootstrap/dist/css/bootstrap.min.css";
import "./ShoppingCartTableCSS.css";
import React from "react";
import { Container, Col, Row, Form, FormControl } from "react-bootstrap";
import ImageService from "../../services/ImageService/ImageService";
import { iconDelete } from "../icons";

function ShoppingCartTable(props) {
  return (
    <Container>
      <Col>
        {props.products.map((item) => {
          return (
            <CartRow
              product={item}
              updateQuantity={props.updateQuantity}
              deleteItem={props.deleteItem}
              shoppingCart={props.shoppingCart}
              key={item.id}
            ></CartRow>
          );
        })}
      </Col>
    </Container>
  );
}

function CartRow(props) {
  let dropdown_items = [];
  for (let i = 1; i < 10; i++) {
    dropdown_items.push(i);
  }
  return (
    <Row className="shopping-cart-row">
      <Col md="auto" sm="12" className="d-flex justify-content-center">
        <img
          alt=""
          width="225"
          className="item-cart-image"
          src={ImageService.returnImageByCategory(props.product.category)}
        />
      </Col>
      <Col md="7" className="px-4">
        <Row className="item-cart-name">{props.product.name}</Row>
        <Row>{props.product.description}</Row>
        <Row className="my-1">{props.product.packaging}</Row>
        <Row className="justify-content-md-start mt-3">
          {props.shoppingCart.get(props.product.id) < 10 ? (
            <Form.Select
              className="form-input-gt10"
              size="sm"
              value={props.shoppingCart.get(props.product.id)}
              onChange={(e) => {
                props.updateQuantity(props.product.id, e.target.value);
              }}
            >
              {dropdown_items.map((i) => {
                return <option value={i}>{i}</option>;
              })}
              <option value="10">10+</option>
            </Form.Select>
          ) : (
            <FormControl
              className="form-input-gt10"
              type="number"
              size="sm"
              step={1}
              value={props.shoppingCart.get(props.product.id)}
              onChange={(e) => {
                props.updateQuantity(props.product.id, e.target.value);
              }}
              max={100}
              min={1}
            />
          )}
          <span
            className="w-auto ml-3 px-0"
            onClick={() => props.deleteItem(props.product.id)}
          >
            {iconDelete}REMOVE
          </span>
        </Row>
      </Col>
      <Col className="item-cart-name text-right">
        {props.product.price}
        {" €"}
      </Col>
    </Row>
  );
}
export { ShoppingCartTable };
