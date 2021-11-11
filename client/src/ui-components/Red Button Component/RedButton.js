import React from "react";
import { Button, DropdownButton,Dropdown } from "react-bootstrap";
import { Link } from "react-router-dom";
import { routes, shoppingCartRouteName } from "../../Routes";

import "bootstrap/dist/css/bootstrap.min.css";
import "./RedButton.css";

function RedButton(props) {
    return (
        <Button className="button">{props.text}</Button>
    );

}
//passo un vettore stringa dove ogni stringa è un item del drop Down
function RedButtonDropDown(props) {
    return (
        <DropdownButton className="dropbtn "  title={props.title}>
            {
                props.items.map((name, index) => <Dropdown.Item className="dropdown-content"  key={index}> {name} </Dropdown.Item>)
            }
        </DropdownButton>
    );

}

export {RedButton, RedButtonDropDown}; 
