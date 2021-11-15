import "bootstrap/dist/css/bootstrap.min.css";
import "./ShoppingCartControlsCSS.css";
import React from "react";
import  Button  from "../Button/Button";
import { Link } from "react-router-dom";

function ShoppingCartControls(props) {
  return (
    <div className="d-flex flex-row-reverse mt-5">
      <Link
        to={{
          pathname: "/",
          state: { cart: props.cart, clientID:props.clientID },
        }}
      >
        <Button className="btn-light mx-3">CONTINUE SHOPPING</Button>
      </Link>
      <Button className="cart-button" onClick={props.handleShow}>
        PLACE ORDER
      </Button>
    </div>
  );
}

export { ShoppingCartControls };
