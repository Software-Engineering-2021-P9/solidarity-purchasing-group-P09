import React from "react";
import { Button, DropdownButton, Dropdown, ButtonGroup } from "react-bootstrap";
import { Link } from "react-router-dom";
import { routes, shoppingCartRouteName } from "../../Routes";

import "bootstrap/dist/css/bootstrap.min.css";
import "./RedButton.css";
import DropdownToggle from "@restart/ui/esm/DropdownToggle";

function RedButton(props) {
  return <Button className="button">{props.text}</Button>;
}
//passo un vettore stringa dove ogni stringa è un item del drop Down
function RedButtonDropDown(props) {
  /*return (
    <DropdownButton as={ButtonGroup} title={props.title} className="dropbtn">
      {props.items.map((name, index) => (
        <Dropdown.Item className="dropdown-content" key={index}>
          {" "}
          {name}{" "}
        </Dropdown.Item>
      ))}
    </DropdownButton>
  );*/

  return (
    <Dropdown as={ButtonGroup}>
      <Dropdown.Toggle id="dropdown-custom-1" className="button">
        {props.title}
      </Dropdown.Toggle>
      <Dropdown.Menu>
        {" "}
        {props.items.map((name, index) => (
          <Dropdown.Item className="dropdown-content" key={index}>
            {" "}
            {name}{" "}
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
}

export { RedButton, RedButtonDropDown };
