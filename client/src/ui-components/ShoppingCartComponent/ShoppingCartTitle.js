import "bootstrap/dist/css/bootstrap.min.css";
import "./ShoppingCartTitleCSS.css";
import React from "react";
import { iconCartTitle } from "../icons";

function ShoppingCartTitle(props) {
  return (
    <h1 className="title px-0">
      <span className="cart-icon mx-0">{iconCartTitle}</span>
      {props.title}
    </h1>
  );
}

export { ShoppingCartTitle };
