import "bootstrap/dist/css/bootstrap.min.css";
import "./ShoppingCartControlsCSS.css";
import React from "react";
import Button from "../Button/Button";
import {Row} from "react-bootstrap";

function ShoppingCartControls(props) {


  return (
    <>
    <Row>
      <Button className="cart-button-placeorder" disabled={props.cart.size === 0} onClick={props.handleShow}>
        PLACE ORDER
      </Button>
    </Row>
    </>
  );
}

{/* <Row>
<Button onClick={()=>{history.push("/", { shoppingCart: props.cart, clientID: props.clientID })}} className="cart-button-shopping" variant='light'>
  CONTINUE SHOPPING
</Button>
</Row> */}
export { ShoppingCartControls };
