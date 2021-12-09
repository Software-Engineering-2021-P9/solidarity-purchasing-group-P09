import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState, useContext, useEffect } from "react";
import { useLocation } from "react-router";
import { Container, Row, Col } from "react-bootstrap";
import { Redirect, Link } from "react-router-dom";
import Button from "../ui-components/Button/Button";

import { NavbarComponent } from "../ui-components/NavbarComponent/NavbarComponent";
import { ShoppingCartTitle } from "../ui-components/ShoppingCartComponent/ShoppingCartTitle";
import { ShoppingCartTable } from "../ui-components/ShoppingCartComponent/ShoppingCartTable";
import { ShoppingCartSummary } from "../ui-components/ShoppingCartComponent/ShoppingCartSummary";
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

  const clientID =
    authContext.currentUser.role === UserRoles.CLIENT
      ? authContext.currentUser.id
      : location.state.clientID;

  useEffect(() => {
    const fetchClientInfo = () => {
      getClientByID(clientID)
        .then((result) => {
          setClient(result);
        })
        .catch((err) => {
          setRequestError("Failed to fetch client data: " + err.message);
        });
    };
    fetchClientInfo();
  }, [clientID]);

  useEffect(() => {
    if (cart.size === 0) {
      setProducts([]);
      return;
    }
    const updateProducts = () => {
      const productIDs = Array.from(cart.keys());
      getProductsByIDs(productIDs)
        .then((result) => {
          setProducts(result);
        })
        .catch((err) => {
          setRequestError("Failed to fetch products data: " + err.message);
        });
    };
    updateProducts();
  }, [cart]);

  /* compute initial total amount */
  var sum = 0.0;
  Array.from(cart.entries()).map((entry) => {
    sum += 1.0 * entry[1]; // mock price
    return entry;
  });

  const [amount, setAmount] = useState(sum);
  const [show, setShow] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const updateQuantity = (productID, quantity) => {
    if (quantity > 0) {
      setCart(new Map(cart.set(productID, parseInt(quantity))));
    }
    var sum = 0.0;
    Array.from(cart.entries()).map((entry) => {
      sum += 1.0 * entry[1]; // mock price
      return entry;
    });
    setAmount(sum);
  };

  const deleteItem = (productID) => {
    let new_cart = new Map();
    var sum = 0.0;
    if (cart.size > 1) {
      Array.from(cart.entries()).map((entry) => {
        const [key, val] = entry;
        if (key === productID) return null;
        new_cart.set(key, val);
        sum += 1.0 * entry[1];
        return entry;
      });
    }
    setAmount(sum);
    setCart(new_cart);
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
        <NavbarComponent
          userIconLink={authContext.getUserIconLink()}
          loggedUser={authContext.currentUser}
        />
      </Row>
      <Row>
        <ShoppingCartTitle
          title={
            authContext.currentUser.role === UserRoles.CLIENT
              ? "Your cart"
              : `${client.fullName}'s cart`
          }
        />
      </Row>
      <Row>
        <Col md="8">
          <Row>
            <ShoppingCartTable
              shoppingCart={cart}
              products={products}
              updateQuantity={updateQuantity}
              deleteItem={deleteItem}
            />
          </Row>
        </Col>
        <Col md="4" sm="12" className="mx-0 px-0">
          <ShoppingCartSummary
            products={products}
            cart={cart}
            tot={amount}
            handleShow={handleShow}
          />
        </Col>
      </Row>
      <Row className="my-4">
        <Link
          className="px-0 mx-0"
          to={{
            pathname: "/",
            state: {
              creatingOrderMode: true,
              shoppingCart: cart,
              clientID: location.state.clientID,
            },
          }}
        >
          <Button variant="light">CONTINUE SHOPPING</Button>
        </Link>
      </Row>

      <ModalOrderConfirmation
        show={show}
        handleClose={handleClose}
        products={products}
        cart={cart}
        tot={amount}
        handleSubmit={handleSubmit}
      />
      <ErrorToast
        errorMessage={requestError}
        onClose={() => setRequestError("")}
      />
      {submitted && authContext.currentUser.role === UserRoles.EMPLOYEE && (
        <Redirect
          to={{
            pathname: "/employee/clients/" + location.state.clientID,
            state: { showOrderAlert: true },
          }}
        />
      )}
      {submitted && authContext.currentUser.role === UserRoles.CLIENT && (
        <Redirect
          to={{
            pathname: "/client",
            state: { showOrderAlert: true, shoppingCart: new Map() },
          }}
        />
      )}
    </Container>
  );
}

export { ShoppingCartPage };
