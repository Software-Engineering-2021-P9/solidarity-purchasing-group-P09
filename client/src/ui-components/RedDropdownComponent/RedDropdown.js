import React from "react";
import { Dropdown, ButtonGroup, Row } from "react-bootstrap";

import "bootstrap/dist/css/bootstrap.min.css";
import "./RedDropdown.css";
//passo un vettore stringa dove ogni stringa è un item del drop Down

function RedDropdown(props) {
  return (
    <Row>
      <Dropdown className='d-flex' as={ButtonGroup}>
        <Dropdown.Toggle id='dropdown-custom-1' className='dropdown'>
          {props.title}
        </Dropdown.Toggle>

        <Row>
          <Dropdown.Menu className='dropdown-menu'>
            {props.items.map((name, index) => (
              <Dropdown.Item
                className='dropdown-content'
                key={index}
                onClick={() => props.updateSelectedItem(name)}
                active={props.activeElement === name}>
                {name}
              </Dropdown.Item>
            ))}
            <Dropdown.Item
              className='dropdown-content'
              onClick={() => props.updateSelectedItem()}
              active={props.title === "Categories"}>
              All
            </Dropdown.Item>
          </Dropdown.Menu>
        </Row>
      </Dropdown>
    </Row>
  );
}

export { RedDropdown };
