import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState, useContext, useEffect } from "react";
import { useLocation } from "react-router";
import { Container, Row } from "react-bootstrap";
import { Redirect } from "react-router-dom";

import { NavbarComponent } from "../ui-components/NavbarComponent/NavbarComponent";
import { ShoppingCartTitle } from "../ui-components/ShoppingCartComponent/ShoppingCartTitle";
import { ShoppingCartTable } from "../ui-components/ShoppingCartComponent/ShoppingCartTable";
import { ShoppingCartTotAmount } from "../ui-components/ShoppingCartComponent/ShoppingCartTotAmount";
import { ShoppingCartControls } from "../ui-components/ShoppingCartComponent/ShoppingCartControls";
import { ModalOrderConfirmation } from "../ui-components/ShoppingCartComponent/ModalOrderConfirmation";
import ErrorToast from "../ui-components/ErrorToast/ErrorToast";
import { AuthContext } from "../contexts/AuthContextProvider";

import {
  getClientByID,
  getProductsByIDs,
  createOrder,
} from "../services/ApiClient";
import UserRoles from "../services/models/UserRoles";

function ShoppingCartPage(props) {
  const location = useLocation();
  const authContext = useContext(AuthContext);

  // as props, ShoppingCartPage receives
  //      - a Map <ItemID, Qty>
  //      - the clientID
  // it mantains as main states
  //      - a cart (Map <ItemID, Qty>)
  //      - the total amount of the current cart
  // it uses function getProductsByIDs(id) -> product object
  // it uses function getClientByID(id) -> client object
  // it uses function createOrder(clientID, cart) -> POST /api/orders

  const [cart, setCart] = useState(location.state.shoppingCart);

  const [client, setClient] = useState({});

  const [products, setProducts] = useState([]);

  const [requestError, setRequestError] = useState("");

  const clientID = authContext.currentUser.role===UserRoles.CLIENT ? authContext.currentUser.id : location.state.clientID; 

  useEffect(() => {
    async function fetchClientInfo() {
      try {
        const clientInfo = await getClientByID(clientID);
        setClient(clientInfo);
      } catch (err) {
        setRequestError("Failed to fetch client data: " + err.message)
      }
    }
    fetchClientInfo();
  }, [clientID]);

  useEffect(() => {
    if (cart.size === 0) {
      setProducts([]);
      return;
    }
    async function updateProducts() {
      try {
        const productIDs = Array.from(cart.keys());
        const server_products = await getProductsByIDs(productIDs);
        setProducts(server_products);
      } catch (err) {
        setRequestError("Failed to fetch products data: " + err.message)
      }
    }
    updateProducts();
  }, [cart]);

  /* compute initial total amount */
  var sum = 0;
  Array.from(cart.entries()).map((entry) => {
    sum += 1.0 * entry[1]; // mock price
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
      if (cart.size > 1) {
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
    var orderProducts = Array.from(cart, ([productID, quantity]) => ({
      productID,
      quantity,
    }));
    //call create order
    createOrder(client.id, orderProducts);
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
          client={client}
          loggedClient={authContext.currentUser.role === UserRoles.CLIENT}
        />
      </Row>
      <Row>
        <ShoppingCartTable
          cart={cart}
          products={products}
          updateQuantity={updateQuantity}
        />
      </Row>
      <Row>
        <ShoppingCartTotAmount tot={amount} />
      </Row>
      <Row>
        <ShoppingCartControls
          handleShow={handleShow}
          clientID={location.state.clientID}
          cart={cart}
        />
      </Row>

      <Row>
        <ModalOrderConfirmation
          show={show}
          handleClose={handleClose}
          products={products}
          cart={cart}
          tot={amount}
          handleSubmit={handleSubmit}
        />
      </Row>
      <ErrorToast
        errorMessage={requestError}
        onClose={() => setRequestError("")}
      />
      {submitted && authContext.currentUser.role === UserRoles.EMPLOYEE ? (
        <Redirect
          to={{
            pathname: "/employee/clients/" + location.state.clientID,
            state: { showOrderAlert: true },
          }}
        />
      ) : (
        ""
      )}
      {submitted && authContext.currentUser.role === UserRoles.CLIENT ? (
        <Redirect
          to={{
            pathname: "/client",
            state: { showOrderAlert: true, shoppingCart: new Map() },
          }}
        />
      ) : (
        ""
      )}
    </Container>
  );
}

export { ShoppingCartPage };
