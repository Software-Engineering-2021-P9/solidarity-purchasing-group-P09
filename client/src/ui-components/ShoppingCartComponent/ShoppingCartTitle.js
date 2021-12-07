import "bootstrap/dist/css/bootstrap.min.css";
import "./ShoppingCartTitleCSS.css";
import React from "react";
import { iconCart2 } from "../icons";

function ShoppingCartTitle(props) {
  return (
    <div className="title">
      <h1>
        {iconCart2}
        {props.title}
      </h1>
    </div>
  );
}

export { ShoppingCartTitle };
