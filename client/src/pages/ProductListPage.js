import { React, useEffect, useState, useContext } from "react";
import { useLocation } from "react-router";
import { Row, Col, CardGroup } from "react-bootstrap";
import { getAvailableNavbarLinks } from "../Routes";

import { NavbarComponent } from "../ui-components/NavbarComponent/NavbarComponent";
import { FilterRow } from "../ui-components/FilterRow/FilterRow";
import ProductCard from "../ui-components/ProductCardComponent/ProductCard";

import "bootstrap/dist/css/bootstrap.min.css";

import { findProducts } from "../services/ApiClient";

import { AuthContext } from "../contexts/AuthContextProvider";
import UserRoles from "../services/models/UserRoles";

function ProductListPage(props) {
  const location = useLocation();
  const authContext = useContext(AuthContext);

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

  const [cartUpdated, setCartUpdated] = useState(false);

  const [cartEmpty, setCartEmpty] = useState(false);

  useEffect(() => {
    //call every time that the cart is updated (added, deleted or quantity modified)
    setCartUpdated(true);
    if (cart.size === 0) setCartEmpty(true);
    else setCartEmpty(false);
  }, [cart]);

  useEffect(() => {
    if (cartUpdated) {
      let interval = setTimeout(() => {
        setCartUpdated(false);
        clearTimeout(interval);
      }, 3000);
    }
    if (cartEmpty) {
      let interval = setTimeout(() => {
        setCartEmpty(false);
        clearTimeout(interval);
      }, 3000);
    }
  }, [cartUpdated, cartEmpty]);

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
        cartUpdated={cartUpdated}
        cartEmpty={cartEmpty}
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
    </>
  );
}

export { ProductListPage };
