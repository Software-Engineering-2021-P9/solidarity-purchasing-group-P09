import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState } from "react";
import { Container, Row } from "react-bootstrap";
import { Redirect } from "react-router-dom";

import { NavbarComponent } from "../ui-components/NavbarComponent/NavbarComponent";
import { ShoppingCartTitle } from "../ui-components/ShoppingCartComponent/ShoppingCartTitle";
import { ShoppingCartTable } from "../ui-components/ShoppingCartComponent/ShoppingCartTable";
import { ShoppingCartTotAmount } from "../ui-components/ShoppingCartComponent/ShoppingCartTotAmount";
import { ShoppingCartControls } from "../ui-components/ShoppingCartComponent/ShoppingCartControls";
import { ModalOrderConfirmation } from "../ui-components/ShoppingCartComponent/ModalOrderConfirmation";

import {
  getClientByID,
  getProductByID,
  createOrder,
} from "../services/ApiClient";

function ShoppingCartPage(props) {
  // as props, ShoppingCartPage receives
  //      - a Map <ItemID, Qty>
  //      - the client
  // it mantains as state
  //      - a cart (Map <ItemID, Qty>)
  //      - the total amount of the current cart
  // it uses function getProductByID(id) -> product object
  // it uses function getClientByID(id) -> client object

  /* MOCK DATA (Map, client) */

  const propsMap = new Map();
  propsMap.set("618e935fb16465325a18a8bc", 1);
  propsMap.set("618e969eb16465325a18a8c6", 1);
  propsMap.set("618e96edb16465325a18a8c7", 1);
  propsMap.set("618ed939f67c1e1c11764bbf", 1);
  const propsClientID = "618d4ad3736f2caf2d3b3ca5";

  /* END MOCK DATA */

  // Convert array to Map in here for next processes
  const [cart, setCart] = useState(propsMap);

  var sum = 0;
  Array.from(cart.entries()).map((entry) => {
    sum += 1;
    return entry;
  });

  const [amount, setAmount] = useState(sum);
  const [show, setShow] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const updateQuantity = (product, quantity) => {
    const prev_qty = cart.get(product);
    if ((quantity < 0 && prev_qty > 0) || quantity > 0) {
      setCart(new Map(cart.set(product, prev_qty + quantity)));
      setAmount(amount + quantity * 1);
    }
  };
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleSubmit = () => {
    //call create order
    //convert back to array format for backend side!
    var products = Array.from(cart, ([productID, quantity]) => ({
      productID,
      quantity,
    }));

    createOrder(propsClientID, products);
    handleClose();
    setSubmitted(true);
  };

  return (
    <Container>
      <Row>
        <NavbarComponent />
      </Row>
      <Row>
        <ShoppingCartTitle client={propsClientID} getClientByID={getClientByID} />
      </Row>
      <Row>
        <ShoppingCartTable
          cart={cart}
          getProductByID={getProductByID}
          updateQuantity={updateQuantity}
        />
      </Row>
      <Row>
        <ShoppingCartTotAmount tot={amount} />
      </Row>
      <Row>
        <ShoppingCartControls
          handleShow={handleShow}
          clientID={propsClientID}
          cart={cart}
        />
      </Row>

      <Row>
        <ModalOrderConfirmation
          show={show}
          handleClose={handleClose}
          getProductByID={getProductByID}
          cart={cart}
          handleSubmit={handleSubmit}
        />
      </Row>
      {submitted ? (
        <Redirect
          to={{
            pathname: "/employee/clients/"+propsClientID,
            state: { clientID: propsClientID },
          }}
        />
      ) : (
        ""
      )}
      {/*REDIRECT TO /clients/propsClientID when "PLACE ORDER is clicked pass props-> cart, propsClientID*/}
      {/*call createOrder*/}
    </Container>
  );
}

export { ShoppingCartPage };
