import "bootstrap/dist/css/bootstrap.min.css";
import "./ShoppingCartControlsCSS.css";
import React from "react";
import Button from "../Button/Button";
import { Link } from "react-router-dom";

function ShoppingCartControls(props) {
  return (
    <div className="d-flex flex-row-reverse mt-5">
      <Link
        to={{
          pathname: "/",
          state: {
            creatingOrderMode: true,
            shoppingCart: props.cart,
            clientID: props.clientID,
          },
        }}
      >
        <Button variant="light" className="mx-3">
          CONTINUE SHOPPING
        </Button>
      </Link>
      <Button disabled={props.cart.size === 0} onClick={props.handleShow}>
        PLACE ORDER
      </Button>
    </div>
  );
}

export { ShoppingCartControls };
