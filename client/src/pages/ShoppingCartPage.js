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
import Button from "../ui-components/Button/Button";

import {
  getClientByID,
  getProductsByIDs,
  createOrder,
} from "../services/ApiClient";
import UserRoles from "../services/models/UserRoles";
import {useHistory} from "react-router-dom";

function ShoppingCartPage(props) {
  const location = useLocation();
  const authContext = useContext(AuthContext);
  const history = useHistory();

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
  
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [deliveryTime, setDeliveryTime] = useState("");
  const [deliveryType, setDeliveryType] = useState("");

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

    //TODO: Modify create order API parameters, in order to take:
    //deliveryDate, deliveryTime, deliveryAddress, pickupIsChecked
    
    //TODO: to pass the shipement fee to create order, we just need
    //to check deliveryType=="Shipment" -> then add fee

    //call create order
    createOrder(client.id, orderProducts);
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
            title={authContext.currentUser.role === UserRoles.CLIENT ?  "Your cart" : `${client.fullName}'s cart`}
          />
      </Row>
      <Row>
        <Col className="col-10">
          <ShoppingCartTable
            cart={cart}
            products={products}
            updateQuantity={updateQuantity}
          />
        </Col>
        <Col style={{"margin-left":"-5%"}}>
          {authContext.currentUser.role === UserRoles.CLIENT &&
             <ShoppingCartOrderSummary 
                products={products}
                cart={cart}

                setAmount={setAmount}
                setDeliveryAddress={setDeliveryAddress}
                setDeliveryDate={setDeliveryDate}
                setDeliveryTime={setDeliveryTime}
                setDeliveryType={setDeliveryType}

                amount={amount}
                deliveryAddress={deliveryAddress}
                deliveryDate={deliveryDate}
                deliveryTime={deliveryTime}
                deliveryType={deliveryType}

                handleShow={handleShow}
              />}
        </Col>
      </Row>
      <Row>
        <Button onClick={()=>{history.push("/", { shoppingCart: cart, clientID: location.state.clientID })}} className="cart-button-shopping" variant='light'>
          CONTINUE SHOPPING
        </Button>
      </Row>

      <Row>
        <ModalOrderConfirmation
          show={show}
          handleClose={handleClose}
          products={products}
          cart={cart}
          tot={amount}
          handleSubmit={handleSubmit}
          deliveryType={deliveryType}
        />
      </Row>
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
