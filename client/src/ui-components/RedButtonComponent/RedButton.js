import React from "react";
import { Button } from "react-bootstrap";

import "bootstrap/dist/css/bootstrap.min.css";
import "./RedButton.css";

function RedButton(props) {
  return (
    <Button className="button" onClick={props.onClick}>
      {props.text}
    </Button>
  );
}

export { RedButton };
