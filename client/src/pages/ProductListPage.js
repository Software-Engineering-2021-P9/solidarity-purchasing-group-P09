import { React, useEffect, useState, useContext } from "react";
import { useLocation } from "react-router";
import {
  Row,
  Col,
  Form,
  CardGroup,
  FormControl,
  Modal,
  Container,
} from "react-bootstrap";
import { getAvailableNavbarLinks } from "../Routes";

import { NavbarComponent } from "../ui-components/NavbarComponent/NavbarComponent";
import { FilterRow } from "../ui-components/FilterRow/FilterRow";
import ProductCard from "../ui-components/ProductCardComponent/ProductCard";
import Button from "../ui-components/Button/Button";

import "../ui-components/ShoppingCartComponent/ShoppingCartControlsCSS.css";
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

  // modal states
  const [show, setShow] = useState(false);

  const [modalProduct, setModalProduct] = useState({});

  const [errorMessage, setErrorMessage] = useState("");

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

  const handleClose = () => setShow(false);

  const handleShow = (product) => {
    setErrorMessage(""); 
    if (cart.get(product.id)) {
      setModalProduct({
        productName: product.name,
        productId: product.id,
        productQty: cart.get(product.id),
      });
    } else
      setModalProduct({
        productName: product.name,
        productId: product.id,
        productQty: 1,
      });
    setShow(true);
  };

  const addItem = (productID, quantity) => {
    if (quantity > 0) {
      setCart(new Map(cart.set(productID, parseInt(quantity))));
      setShow(false);
    } else {
      setErrorMessage("Insert a valid quantity.");
    }
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

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{modalProduct.productName}</Modal.Title>
        </Modal.Header>
        <Container>
          <Row>
            <Form.Label>Select a quantity</Form.Label>
          </Row>
          <Row className="my-1 mb-3 px-3">
            <FormControl
              type="number"
              step={1}
              value={modalProduct.productQty}
              onChange={(e) =>{
                setModalProduct({ ...modalProduct, productQty: e.target.value }); setErrorMessage("");
              }}
              max={100}
              min={1}
            />
          </Row>
          {errorMessage && (
            <Row>
              <p className="text-danger">{errorMessage}</p>
            </Row>
          )}
        </Container>
        <Modal.Footer>
          <Button variant="light" onClick={handleClose}>
            Close
          </Button>
          <Button
            onClick={() =>
              addItem(modalProduct.productId, modalProduct.productQty)
            }
          >
            Submit
          </Button>
        </Modal.Footer>
      </Modal>

      <FilterRow
        text={text}
        handleCategoryChanged={handleCategoryChanged}
        handleFormSubmit={handleFormSubmit}
        category={category}
        setText={setText}
        handleOnSearchSubmit={handleOnSearchSubmit}
      />

      <Row lg={4} md={3} sm={2} xs={1} className="g-4">
        {products
          ? products.map((item) => {
              return (
                <CardGroup as={Col}>
                  <ProductCard
                    product={item}
                    // if the employee is creating a new order or is just showing available products
                    creatingOrderMode={
                      location.state?.creatingOrderMode ||
                      authContext?.currentUser?.role === UserRoles.CLIENT
                    }
                    handleShow={handleShow}
                  />
                </CardGroup>
              );
            })
          : {}}
      </Row>
    </>
  );
}

export { ProductListPage };
