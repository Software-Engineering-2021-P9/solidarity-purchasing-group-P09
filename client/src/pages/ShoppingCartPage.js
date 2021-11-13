import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState } from "react";
import { Container, Row } from "react-bootstrap";
import { Redirect } from "react-router-dom";

import { NavbarComponent } from "../ui-components/NavbarComponent/NavbarComponent";
import { ShoppingCartTitle } from "../ui-components/ShoppingCartComponent/ShoppingCartTitle";
import { ShoppingCartTable } from "../ui-components/ShoppingCartComponent/ShoppingCartTable";
import { ShoppingCartTotAmount } from "../ui-components/ShoppingCartComponent/ShoppingCartTotAmount";
import { ShoppingCartControls } from "../ui-components/ShoppingCartComponent/ShoppingCartControls";
import { ModalOrderConfirmed } from "../ui-components/ShoppingCartComponent/ModalOrderConfirmed";

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

  /* MOCK DATA (Map, client, getProductById) */
  const propsMap = new Map();
  propsMap.set(1, 1);
  propsMap.set(2, 1);
  propsMap.set(3, 1);
  propsMap.set(4, 1);

  // This is the format for the backend, I am not sure if can we use this format????
  // Mock data, same with the postman request
  // If we can get this format from props, then we are totally done!

  const mockProductQuantity = [
    { productId: "718d971d89d6240eb03742d7", quantity: 3 },
    { productId: "298d971d89d6240eb03742d7", quantity: 1 },
    { productId: "318d971d89d6240eb03742d7", quantity: 2 },
    { productId: "418d971d89d6240eb03742d7", quantity: 3 },
  ];

  const propsClientId = "918d971d89d6240eb03742d7";

  const getProductById = (id) => {
    const staticProducts = [
      {
        id: "718d971d89d6240eb03742d7",
        item: "Eggplant",
        description: "Origin: Italy, packaging: 1kg",
        price: 2.5,
      },
      {
        id: "298d971d89d6240eb03742d7",
        item: "Zucchini",
        description: "Origin: Italy, packaging: 1kg",
        price: 3,
      },
      {
        id: "318d971d89d6240eb03742d7",
        item: "Eggs",
        description: "Origin: Italy, packaging: 6 eggs",
        price: 1.6,
      },
      {
        id: "418d971d89d6240eb03742d7",
        item: "Milk",
        description: "Origin: Italy, packaging: 2l",
        price: 1,
      },
    ];
    return staticProducts.filter((p) => p.id === id)[0];
  };

  const getClientById = (id) => {
    return {
      id: id,
      name: "John",
      surname: "Smith",
    };
  };

  /* END MOCK DATA */

  // Convert array to Map in here for next processes
  const [cart, setCart] = useState(
    new Map(mockProductQuantity.map((i) => [i.productId, i.quantity]))
  );

  var sum = 0;
  Array.from(cart.entries()).map((entry) => {
    const key = entry[0];
    const product = getProductById(key);
    sum += product.price;
    return entry;
  });

  const [amount, setAmount] = useState(sum);
  const [show, setShow] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const updateQuantity = (product, quantity) => {
    const prev_qty = cart.get(product.id);
    if ((quantity < 0 && prev_qty > 0) || quantity > 0) {
      setCart(new Map(cart.set(product.id, prev_qty + quantity)));
      setAmount(amount + quantity * product.price);
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
        <ShoppingCartTitle client={getClientById(propsClientId)} />
      </Row>
      <Row>
        <ShoppingCartTable
          cart={cart}
          getProductById={getProductById}
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
