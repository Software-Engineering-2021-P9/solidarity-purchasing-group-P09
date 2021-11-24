import { React, useEffect, useState } from "react";
import {
  Row,
  Col,
  Form,
  CardGroup,
  FormControl,
  Modal,
  Container,
  Alert
} from "react-bootstrap";
import { employeeNavbarLinks } from "../Routes";
import { NavbarComponent } from "../ui-components/NavbarComponent/NavbarComponent";
import Product from "../services/models/Product";
import ProductCard from "../ui-components/ProductCardComponent/ProductCard";
import { RedButton } from "../ui-components/RedButtonComponent/RedButton";
import { RedDropdown } from "../ui-components/RedDropdownComponent/RedDropdown";
import Button from "../ui-components/Button/Button";
import "../ui-components/ShoppingCartComponent/ShoppingCartControlsCSS.css";
import "../ui-components/Title.css";
import "bootstrap/dist/css/bootstrap.min.css";

import { findProducts } from "../services/ApiClient";

function ProductListPage(props) {
  const [products, setProducts] = useState([]);

  //used for storing the content of the search form
  const [text, setText] = useState();

  //updated when selected a new category
  const [category, setCategory] = useState();

  //updated only when clicked on search
  const [searchString, setSearchString] = useState();

  //current cart
  const [cart, setCart] = useState(
    props.location.state ? props.location.state.shoppingCart : new Map()
  );

  // if the employee is creating a new order or is just showing available products
  var creatingOrderMode = props.location.state ? true : false;

  // MOCK DATA
  var isAClient = true;
  // END DATA

  if (isAClient) creatingOrderMode = true;

  // modal states
  const [show, setShow] = useState(false);
  const [showAlert, setShowAlert] = useState(false); 

  const [modalProduct, setModalProduct] = useState({});

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
    setCart(new Map(cart.set(productID, parseInt(quantity))));
    setShow(false);
  };

  return (
    <>
      <NavbarComponent
        links={employeeNavbarLinks}
        showShoppingCart
        shoppingCartItems={cart.size}
        shoppingCart={cart}
        clientID={
          props.location.state
            ? props.location.state.clientID
            : "619d06384d6847a9a1eb77cd"
        }
        isAClient={isAClient}
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
              onChange={(e) =>
                setModalProduct({ ...modalProduct, productQty: e.target.value })
              }
              max={100}
              min={1}
            />
          </Row>
        </Container>
        <Modal.Footer>
          <Button className="btn-light" onClick={handleClose}>
            Close
          </Button>
          <Button
            className="btn-primary"
            onClick={() =>
              addItem(modalProduct.productId, modalProduct.productQty)
            }
          >
            Submit
          </Button>
        </Modal.Footer>
      </Modal>
      {props.location.state != null && props.location.state.orderAmount != null ? (
        <Row>
          <Alert
            variant="success"
            style={{
              color: "#635F46",
              fontWeight: "bold",
              backgroundColor: "#7465132f",
              width: "auto",
              marginTop: "1%",
              marginLeft: "1%",
            }}
            onClose={() => setShowAlert(false)}
            dismissible
          >
            Your order was successfully created!
          </Alert>
        </Row>
      ) : (
        ""
      )}
      <Row className="align-items-center">
        <h1 className="title">Available products</h1>
      </Row>
      <Row className="sticky ">
        <Col xs={{ span: 4 }}>
          <RedDropdown
            items={Object.values(Product.Categories)}
            title={category ? category : "Categories"}
            updateSelectedItem={handleCategoryChanged}
            activeElement={category}
          />
        </Col>
        <Col xs={{ span: 4, offset: 4 }}>
          <Form onSubmit={(ev) => handleFormSubmit(ev)}>
            <Row>
              <Col xs={{ span: 8 }}>
                <FormControl
                  type="textarea"
                  placeholder="Filter"
                  value={text}
                  onChange={(ev) => setText(ev.target.value)}
                />
              </Col>
              <Col xs={{ span: 1, offset: 1 }}>
                <RedButton text="Search" onClick={handleOnSearchSubmit} />
              </Col>
            </Row>
          </Form>
        </Col>
        <hr className="line" />
      </Row>

      <Row md={4} xs={2} className="g-4">
        {products
          ? products.map((item) => {
              return (
                <CardGroup as={Col}>
                  <ProductCard
                    product={item}
                    creatingOrderMode={creatingOrderMode}
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
