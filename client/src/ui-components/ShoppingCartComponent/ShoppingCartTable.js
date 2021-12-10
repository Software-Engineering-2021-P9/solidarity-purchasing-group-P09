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
  let left_availability = 14; //mock left_availability
  let dropdown_items = [];
  for (let i = 1; i < 11; i++) {
    if (i <= left_availability) {
      dropdown_items.push(i);
    }
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
          {left_availability <= 10 ||
          props.shoppingCart.get(props.product.id) < 10 ? (
            <Form.Select
              className="form-input-gt10"
              size="sm"
              value={props.shoppingCart.get(props.product.id)}
              onChange={(e) => {
                props.updateQuantity(props.product.id, e.target.value);
              }}
            >
              {dropdown_items.map((i) => {
                if (i === 10 && left_availability > 10)
                  return (
                    <option value={i}>
                      {i}
                      {"+"}
                    </option>
                  );
                else return <option value={i}>{i}</option>;
              })}
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
              max={left_availability}
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
