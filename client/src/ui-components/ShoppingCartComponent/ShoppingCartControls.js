import "bootstrap/dist/css/bootstrap.min.css";
import "./ShoppingCartControlsCSS.css";
import React from "react";
import Button from "../Button/Button";
import {Row} from "react-bootstrap";
import {useHistory} from "react-router-dom";

function ShoppingCartControls(props) {
  const history = useHistory();

  return (
    <>
    <Row>
      <Button onClick={()=>{history.push("/", { shoppingCart: props.cart, clientID: props.clientID })}} className="cart-button-shopping" variant='light'>
        CONTINUE SHOPPING
      </Button>
    </Row>
    <Row>
      <Button className="cart-button-placeorder" disabled={props.cart.size === 0} onClick={props.handleShow}>
        PLACE ORDER
      </Button>
    </Row>
    </>
  );
}

export { ShoppingCartControls };
