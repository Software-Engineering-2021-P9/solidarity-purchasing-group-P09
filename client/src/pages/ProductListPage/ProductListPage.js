import { React, useEffect, useState, useContext } from "react";
import { useLocation, useHistory } from "react-router";
import { Row, Col, CardGroup, Modal, Button } from "react-bootstrap";
import { getAvailableNavbarLinks } from "../../Routes";

import { NavbarComponent } from "../../ui-components/NavbarComponent/NavbarComponent";
import { FilterRow } from "../../ui-components/FilterRow/FilterRow";
import ProductCard from "../../ui-components/ProductCardComponent/ProductCard";

import "bootstrap/dist/css/bootstrap.min.css";
import "./ProductListPage.css";
import { alertIcon } from "../../ui-components/icons"

import { findProducts, getOrders } from "../../services/ApiClient";
import  Order  from "../../services/models/Order"

import { AuthContext } from "../../contexts/AuthContextProvider";
import UserRoles from "../../services/models/UserRoles";

function ProductListPage(props) {
  const location = useLocation();
  const authContext = useContext(AuthContext);
  const history = useHistory();

  const [products, setProducts] = useState([]);

  //used for storing the content of the search form
  const [text, setText] = useState();

  //updated when selected a new category
  const [category, setCategory] = useState();

  //updated only when clicked on search
  const [searchString, setSearchString] = useState();

  //current cart
  const [cart, setCart] = useState(
    location.state ? location.state.shoppingCart : new Map()
  );

  const currentUser = authContext.currentUser;
  const [firstTimeNotify, setFirstTimeNotify] = useState(true);
  const [clientHasNotCoveredOrders, setClientHasNotCoveredOrders] = useState(false);

  if(clientHasNotCoveredOrders === false && currentUser !== null && currentUser.role === "client"){
    getOrders(currentUser.id).then(orders=>{
      if(orders.filter(order=>order.status === Order.OrderStatus.NOT_COVERED).length > 0)
        setClientHasNotCoveredOrders(true);
    }).catch(err=>{
      throw(err);
    });
  }

  useEffect(() => {
    //call from props the function for fetching the new products
    async function updateProducts() {
      try {
        const fromServer = await findProducts(category, searchString);
        setProducts(fromServer);
      } catch (err) {
        console.error(`findProducts() -> couldn't retrieve products: ${err}`);
      }
    }
    updateProducts();
  }, [category, searchString]);

  const handleOnSearchSubmit = () => {
    //update searchString, this way useEffect is called
    setSearchString(text);
  };

  const handleFormSubmit = (ev) => {
    ev.preventDefault();
    handleOnSearchSubmit();
  };

  const handleCategoryChanged = (newCategory) => {
    setCategory(newCategory);
  };

  const addItem = (productID, quantity) => {
    if (quantity > 0) {
      setCart(new Map(cart.set(productID, parseInt(quantity))));
    }
  };

  const deleteItem = (productID) => {
    let new_cart = new Map();
    Array.from(cart.entries()).map((entry) => {
      const [key, val] = entry;
      if (key === productID) return null;
      new_cart.set(key, val);
      return entry;
    });
    setCart(new_cart);
  };

  return (
    <>
      <NavbarComponent
        links={getAvailableNavbarLinks(authContext.currentUser)}
        loggedUser={authContext.currentUser}
        showShoppingCart
        shoppingCartItems={cart.size}
        shoppingCart={cart}
        clientID={location.state ? location.state.clientID : ""}
        userIconLink={authContext.getUserIconLink()}
      />

      <FilterRow
        text={text}
        handleCategoryChanged={handleCategoryChanged}
        handleFormSubmit={handleFormSubmit}
        category={category}
        setText={setText}
        handleOnSearchSubmit={handleOnSearchSubmit}
      />

      <Row lg={4} md={3} sm={2} xs={1} className="g-4">
        {products &&
          products.map((item) => {
            return (
              <CardGroup as={Col}>
                <ProductCard
                  product={item}
                  shoppingCart={cart}
                  addItem={addItem}
                  deleteItem={deleteItem}
                  key={item.id}
                  // if the employee is creating a new order or is just showing available products
                  creatingOrderMode={
                    location.state?.creatingOrderMode ||
                    authContext?.currentUser?.role === UserRoles.CLIENT
                  }
                />
              </CardGroup>
            );
          })}
      </Row>

      <Modal centered show={currentUser !== null && currentUser.role === "client" && clientHasNotCoveredOrders && firstTimeNotify}>
        <Modal.Header>
          <div className="margin-auto center-text">
            <Modal.Title className="margin-auto" > {alertIcon} Insufficient Wallet Balance</Modal.Title>
          </div>
        </Modal.Header>

        <Modal.Body>
          <p className="center-text">At the moment there are orders with status "not covered", waiting for a wallet top up.</p>
          <p className="center-text">Not covered orders will be deleted at the defined deadline.</p>
        </Modal.Body>

        <Modal.Footer>
          <div className="margin-auto">
            <Button className="product-list-page-popup-buttons" variant="primary" onClick={()=>{setFirstTimeNotify(false)}} >Close</Button>
          </div>
            <div className="margin-auto">
            <Button className="product-list-page-popup-buttons" variant="primary" onClick={()=>{history.push("/client")}}>Check Orders</Button>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export { ProductListPage };
