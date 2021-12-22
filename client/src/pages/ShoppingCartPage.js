import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState, useContext, useEffect } from "react";
import { useLocation } from "react-router";
import { Container, Row, Col } from "react-bootstrap";
import { Redirect } from "react-router-dom";

import { NavbarComponent } from "../ui-components/NavbarComponent/NavbarComponent";
import { ShoppingCartTitle } from "../ui-components/ShoppingCartComponent/ShoppingCartTitle";
import { ShoppingCartTable } from "../ui-components/ShoppingCartComponent/ShoppingCartTable";
import { ShoppingCartOrderSummary } from "../ui-components/ShoppingCartComponent/ShoppingCartOrderSummary";
import { ModalOrderConfirmation } from "../ui-components/ShoppingCartComponent/ModalOrderConfirmation";
import ErrorToast from "../ui-components/ErrorToast/ErrorToast";
import { AuthContext } from "../contexts/AuthContextProvider";

import {
  getClientByID,
  getProductsByIDs,
  createOrder,
  getNextWeekProductAvailability,
} from "../services/ApiClient";
import UserRoles from "../services/models/UserRoles";

function ShoppingCartPage(props) {
  const location = useLocation();
  const authContext = useContext(AuthContext);

  const [cart, setCart] = useState(location.state.shoppingCart);

  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("3"); // 3 or 4 or 5th day of week
  const [deliveryTime, setDeliveryTime] = useState("");
  const [deliveryType, setDeliveryType] = useState("");
  const [deliveryFee, setDeliveryFee] = useState(0);

  const [client, setClient] = useState({});

  const [products, setProducts] = useState([]);

  const [requestError, setRequestError] = useState("");

  const [amount, setAmount] = useState(0);
  const [show, setShow] = useState(false);
  const [submitted, setSubmitted] = useState(false);

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
        .then(async (serverProducts) => {
          let sum = 0;
          let temp_products = [];
          for (let p of serverProducts) {
            p.availability = await getNextWeekProductAvailability(p.id);
            temp_products.push(p);
            sum = sum + p.availability.price * cart.get(p.id);
          }
          await setProducts(temp_products);
          setAmount(sum);
        })
        .catch((err) => {
          setRequestError("Failed to fetch products data: " + err.message);
        });
    };
    updateProducts();
  }, [cart]);

  const updateQuantity = (productID, quantity) => {
    if (quantity > 0) {
      setCart(new Map(cart.set(productID, parseInt(quantity))));
    }
  };

  const deleteItem = (productID) => {
    let new_cart = new Map();
    if (cart.size > 1) {
      Array.from(cart.entries()).map((entry) => {
        const [key, val] = entry;
        if (key === productID) return null;
        new_cart.set(key, val);
        return entry;
      });
    }
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

    let shipmentInfo = {
      type: deliveryType,
      address: deliveryAddress,
    };

    if (deliveryType === "pickup")
      shipmentInfo["pickUpSlot"] =
        deliveryDate + "" + deliveryTime.replace(":", "");

    //call create order
    createOrder(client.id, orderProducts, shipmentInfo);
    handleClose();
    setSubmitted(true);
  };

  return (
    <Container className="px-5 py-3" fluid>
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
        <Col md="4" sm="12" className="px-0">
          <ShoppingCartOrderSummary
            products={products}
            cart={cart}
            setAmount={setAmount}
            setDeliveryAddress={setDeliveryAddress}
            setDeliveryDate={setDeliveryDate}
            setDeliveryType={setDeliveryType}
            setDeliveryFee={setDeliveryFee}
            setDeliveryTime={setDeliveryTime}
            amount={amount}
            deliveryAddress={deliveryAddress}
            deliveryDate={deliveryDate}
            deliveryType={deliveryType}
            deliveryFee={deliveryFee}
            deliveryTime={deliveryTime}
            handleShow={handleShow}
          />
        </Col>
      </Row>

      <ModalOrderConfirmation
        show={show}
        handleClose={handleClose}
        products={products}
        cart={cart}
        tot={amount}
        handleSubmit={handleSubmit}
        deliveryType={deliveryType}
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
