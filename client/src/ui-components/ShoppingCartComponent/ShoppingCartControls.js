import "bootstrap/dist/css/bootstrap.min.css";
import "./ShoppingCartControlsCSS.css";
import React from "react";
import Button from "../Button/Button";
import { Link } from "react-router-dom";
import { Col, Row} from "react-bootstrap";


function ShoppingCartControls(props) {
  return (
    <Row>
      <Col>
        <Link
          to={{
            pathname: "/",
            state: { shoppingCart: props.cart, clientID: props.clientID },
          }}>
          <Button className="cart-button-shopping" variant='light'>
            CONTINUE SHOPPING
          </Button>
        </Link>
      </Col>
      <Col>
        <Button className="cart-button-placeorder" disabled={props.cart.size === 0} onClick={props.handleShow}>
          PLACE ORDER
        </Button>
      </Col>
    </Row>
  );
}

export { ShoppingCartControls };
