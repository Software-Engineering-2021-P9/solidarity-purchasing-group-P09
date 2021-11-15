import "bootstrap/dist/css/bootstrap.min.css";
import "../ShoppingCartComponent/ShoppingCartControls";
import React from "react";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";

function CreateNewOrderButton(props) {
  return (
    <Link to={{ pathname: "/", state: { clientID: props.clientID, shoppingCart: new Map()} }}>
      <Button className="cart-button">CREATE NEW ORDER</Button>
    </Link>
  );
}
export { CreateNewOrderButton };
