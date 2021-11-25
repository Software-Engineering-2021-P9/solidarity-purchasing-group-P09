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
  getProductsByIDs,
  createOrder,
} from "../services/ApiClient";

function ShoppingCartPage(props) {
  // as props, ShoppingCartPage receives
  //      - a Map <ItemID, Qty>
  //      - the clientID
 
  //  - the fact that the user is a client (maybe boolean client=true)    NEW!
  
  // it mantains as main states
  //      - a cart (Map <ItemID, Qty>)
  //      - the total amount of the current cart
  // some other states for showing/hidding the modal and submitting the order  
  // it uses function getProductsByIDs(id) -> product object
  // it uses function getClientByID(id) -> client object
  // it uses function createOrder(clientID, cart) -> POST /api/orders

  const propsClientID = props.location.state? props.location.state.clientID : ''; 

  const isClientLogged = props.location.state? props.location.state.isClientLogged : false; 

  const [cart, setCart] = useState(props.location.state.shoppingCart);

  /* compute initial total amount */
  var sum = 0;
  Array.from(cart.entries()).map((entry) => {
    sum += 1.0*entry[1];   // mock price
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
      if(cart.size>1){
        Array.from(cart.entries()).map((entry) => {
          const [key, val] = entry;
          if (key === product) return null;
          newMap.set(key, val);
          return entry;
        });
      }
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
    <Container className="px-5 py-3">
      <Row>
        <NavbarComponent />
      </Row>
      <Row>
        <ShoppingCartTitle
          client={propsClientID}
          getClientByID={getClientByID}
          isClientLogged={isClientLogged}
        />
      </Row>
      <Row>
        <ShoppingCartTable
          cart={cart}
          getProductsByIDs={getProductsByIDs}
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
          getProductsByIDs={getProductsByIDs}
          cart={cart}
          tot={amount}
          handleSubmit={handleSubmit}
        />
      </Row>
      {submitted && !isClientLogged ? (
        <Redirect
          to={{
            pathname: "/employee/clients/" + propsClientID,  state: { orderAmount: amount}
          }}
        />
      ) : (
        ""
      )}
      {submitted && isClientLogged ? (
        <Redirect
          to={{
            pathname: "/clientID="+propsClientID,  state: { orderAmount: amount, clientID:propsClientID, shoppingCart:new Map()}
          }}
        />
      ):""}
    </Container>
  );
}
export { ShoppingCartPage };
