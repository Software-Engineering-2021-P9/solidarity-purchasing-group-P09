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
  //      - the clientID
  // it mantains as main states
  //      - a cart (Map <ItemID, Qty>)
  //      - the total amount of the current cart
  // it uses function getProductByID(id) -> product object
  // it uses function getClientByID(id) -> client object
  // it uses function createOrder(clientID, cart) -> POST /api/orders

  /* MOCK DATA (Map, client) */

  const propsMap = new Map();
  propsMap.set("618e935fb16465325a18a8bc", 1);
  propsMap.set("618e969eb16465325a18a8c6", 1);
  propsMap.set("618e96edb16465325a18a8c7", 1);
  propsMap.set("618ed939f67c1e1c11764bbf", 1);

  const propsClientID = "618d4ad3736f2caf2d3b3ca5";

  /* END MOCK DATA */

  const [cart, setCart] = useState(propsMap);

  /* compute initial total amount */
  var sum = 0;
  Array.from(cart.entries()).map((entry) => {
    sum += 1.0;   // mock price
    return entry;
  });

  const [amount, setAmount] = useState(sum);
  const [show, setShow] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const updateQuantity = (product, quantity, price) => {
    const prev_qty = cart.get(product);
    // remove from cart
    if (quantity < 0 && prev_qty === 1) {
      const newMap = new Map();
      Array.from(cart.entries()).map((entry) => {
        const [key, val] = entry;
        if (key === product) return entry;
        newMap.set(key, val);
        return entry;
      });
      setCart(newMap);
    }
    // decrease qty which is still > 0 || increase it
    else if ((quantity < 0 && prev_qty > 1) || quantity > 0) {
      setCart(new Map(cart.set(product, prev_qty + quantity)));
    }
    // update total amount
    setAmount(amount + quantity * price);
  };

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleSubmit = () => {
    //convert back to array format for backend side!
    var products = Array.from(cart, ([productID, quantity]) => ({
      productID,
      quantity,
    }));
    //call create order
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
        <ShoppingCartTitle
          client={propsClientID}
          getClientByID={getClientByID}
        />
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
          tot={amount}
          handleSubmit={handleSubmit}
        />
      </Row>
      {submitted ? (
        <Redirect
          to={{
            pathname: "/employee/clients/" + propsClientID,
          }}
        />
      ) : (
        ""
      )}
    </Container>
  );
}

export { ShoppingCartPage };
