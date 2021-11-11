import 'bootstrap/dist/css/bootstrap.min.css';
import './ShoppingCartControlsCSS.css';
import React from 'react';
import {Button} from "react-bootstrap";


function ShoppingCartControls(props) {

    return (
        <div className="d-flex flex-row-reverse mt-5">
            <Button className="cart-inverse-button">CONTINUE SHOPPING</Button>
            <Button className="cart-button" onClick={props.handleShow}>PLACE ORDER</Button>
        </div>
    );
}

export { ShoppingCartControls };