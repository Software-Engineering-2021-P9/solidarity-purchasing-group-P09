import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import Button from "../Button/Button";
import { Link } from "react-router-dom";

function CreateNewOrderButton(props) {
  return (
    <Link
      to={{
        pathname: "/",
        state: {
          clientID: props.clientID,
          creatingOrderMode: true,
          shoppingCart: new Map(),
        },
      }}
    >
      <Button className="cart-button">CREATE NEW ORDER</Button>
    </Link>
  );
}
export { CreateNewOrderButton };
