import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState } from "react";
import { Container, Row } from "react-bootstrap";

import { NavbarComponent } from "../ui-components/NavbarComponent/NavbarComponent";
import { ShoppingCartTitle } from "../ui-components/ShoppingCartComponent/ShoppingCartTitle";
import { ShoppingCartTable } from "../ui-components/ShoppingCartComponent/ShoppingCartTable";
import { ShoppingCartTotAmount } from "../ui-components/ShoppingCartComponent/ShoppingCartTotAmount";
import { ShoppingCartControls } from "../ui-components/ShoppingCartComponent/ShoppingCartControls";
import { ModalOrderConfirmed } from "../ui-components/ShoppingCartComponent/ModalOrderConfirmed";

function ShoppingCartPage(props) {
  // as props, ShoppingCartPage receives
  //      - a Map <ItemID, Qty>
  //      - the client
  // it mantains as state
  //      - a cart (Map <ItemID, Qty>)
  //      - the total amount of the current cart
  // it uses function getProductById(id) -> product object

  /* MOCK DATA (Map, client, getProductById) */
  const propsMap = new Map();
  propsMap.set(1, 1);
  propsMap.set(2, 1);
  propsMap.set(3, 1);
  propsMap.set(4, 1);

  const propsClient = "John Smith";

  const getProductById = (id) => {
    const staticProducts = [
      {
        id: 1,
        item: "Eggplant",
        description: "Origin: Italy, packaging: 1kg",
        price: 2.5,
      },
      {
        id: 2,
        item: "Zucchini",
        description: "Origin: Italy, packaging: 1kg",
        price: 3,
      },
      {
        id: 3,
        item: "Eggs",
        description: "Origin: Italy, packaging: 6 eggs",
        price: 1.6,
      },
      {
        id: 4,
        item: "Milk",
        description: "Origin: Italy, packaging: 2l",
        price: 1,
      },
    ];
    const product = staticProducts.filter((p) => p.id === id)[0];
    return product;
  };

  /* END MOCK DATA */

  const [cart, setCart] = useState(propsMap);

  var sum = 0;
  Array.from(cart.entries()).map((entry) => {
    const key = entry[0];
    const product = getProductById(key);
    sum += product.price;
    return entry;
  });

  const [amount, setAmount] = useState(sum);
  const [show, setShow] = useState(false);

  const updateQuantity = (product, quantity) => {
    const prev_qty = cart.get(product.id);
    if ((quantity < 0 && prev_qty > 0) || quantity > 0) {
      setCart(new Map(cart.set(product.id, prev_qty + quantity)));
      setAmount(amount + quantity * product.price);
    }
  };
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <Container>
      <Row>
        <NavbarComponent />
      </Row>
      <Row>
        <ShoppingCartTitle client={propsClient} />
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
        <ShoppingCartControls handleShow={handleShow} />
      </Row>
      <Row>
        <ModalOrderConfirmed
          show={show}
          handleClose={handleClose}
          cart={cart}
        />
      </Row>
    </Container>
  );
}

export { ShoppingCartPage };