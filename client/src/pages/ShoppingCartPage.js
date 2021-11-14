import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState, useEffect } from "react";
import { Container, Row } from "react-bootstrap";
import { Redirect } from "react-router-dom";

import { NavbarComponent } from "../ui-components/NavbarComponent/NavbarComponent";
import { ShoppingCartTitle } from "../ui-components/ShoppingCartComponent/ShoppingCartTitle";
import { ShoppingCartTable } from "../ui-components/ShoppingCartComponent/ShoppingCartTable";
import { ShoppingCartTotAmount } from "../ui-components/ShoppingCartComponent/ShoppingCartTotAmount";
import { ShoppingCartControls } from "../ui-components/ShoppingCartComponent/ShoppingCartControls";
import { ModalOrderConfirmed } from "../ui-components/ShoppingCartComponent/ModalOrderConfirmed";

import { getClientByID, getProductByID } from "../services/ApiClient";

import { createOrder } from "../services/ApiClient";
function ShoppingCartPage(props) {
  // as props, ShoppingCartPage receives
  //      - a Map <ItemID, Qty>
  //      - the client
  // it mantains as state
  //      - a cart (Map <ItemID, Qty>)
  //      - the total amount of the current cart
  // it uses function getProductById(id) -> product object
  // it uses function getClientById(id) -> client object

  /* MOCK DATA (Map, client) */

  const propsMap = new Map();
  propsMap.set("618e935fb16465325a18a8bc", 1);
  propsMap.set("618e969eb16465325a18a8c6", 1);
  propsMap.set("618e96edb16465325a18a8c7", 1);
  propsMap.set("618ed939f67c1e1c11764bbf", 1);

  const propsClientId = "918d971d89d6240eb03742d7";

  /* END MOCK DATA */

  // Convert array to Map in here for next processes
  const [cart, setCart] = useState(propsMap);
  const [amount, setAmount] = useState(0);

  useEffect(() => {
    var sum = 0;
    const getInitialAmount = (id) => {
      getProductByID(id).then(function (res) {
        sum += res.price;
        setAmount(sum);
      });
    };
    for (let key of cart.keys()) {
      getInitialAmount(key);
    }
  }, []);

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
    var products = Array.from(cart, ([productId, quantity]) => ({
      productId,
      quantity,
    }));

    createOrder(propsClientId, products);
    handleClose();
    setSubmitted(true);
  };

  return (
    <Container>
      <Row>
        <NavbarComponent />
      </Row>
      <Row>
        <ShoppingCartTitle client={getClientByID(propsClientId)} />
      </Row>
      <Row>
        <ShoppingCartTable
          cart={cart}
          getProductById={getProductByID}
          updateQuantity={updateQuantity}
        />
      </Row>
      <Row>
        <ShoppingCartTotAmount tot={amount} />
      </Row>
      <Row>
        <ShoppingCartControls
          handleShow={handleShow}
          clientId={propsClientId}
          cart={cart}
        />
      </Row>

      <Row>
        <ModalOrderConfirmed
          show={show}
          handleClose={handleClose}
          cart={cart}
          handleSubmit={handleSubmit}
        />
      </Row>
      {submitted ? (
        <Redirect
          to={{
            pathname: "/employee/clients/1",
            state: { clientId: propsClientId },
          }}
        />
      ) : (
        ""
      )}
      {/*REDIRECT TO /clients/propsClientId when "PLACE ORDER is clicked pass props-> cart, propsClientId*/}
      {/*call createOrder*/}
    </Container>
  );
}

export { ShoppingCartPage };
