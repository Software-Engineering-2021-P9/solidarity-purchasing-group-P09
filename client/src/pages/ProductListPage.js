import { React, useEffect, useState } from "react";
import {
  Row,
  Col,
  Form,
  CardGroup,
  FormControl,
  Modal,
  Container,
} from "react-bootstrap";
import { employeeNavbarLinks } from "../Routes";
import { NavbarComponent } from "../ui-components/NavbarComponent/NavbarComponent";
import Product from "../services/models/Product";
import ProductCard from "../ui-components/ProductCardComponent/ProductCard";
import { RedButton } from "../ui-components/RedButtonComponent/RedButton";
import { RedDropdown } from "../ui-components/RedDropdownComponent/RedDropdown";
import  Button  from "../ui-components/Button/Button";
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
  const [cart, setCart] = useState(props.location.state ? props.location.state.shoppingCart : new Map());

  // if the employee is creating a new order or is just showing available products
  const creatingOrderMode = props.location.state ? true : false; 

  // modal states
  const [show, setShow] = useState(false);

  const [modalProduct, setModalProduct] = useState({});
  
  const [modalQuantity, setModalQuantity] = useState(1);

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
    setModalProduct(product);
    if(cart.get(product.id)){
      setModalQuantity(parseInt(cart.get(modalProduct.id))); 
    }
    else
      setModalQuantity(1); 
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
        clientID={props.location.state ? props.location.state.clientID: ''}
      />

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{modalProduct.name}</Modal.Title>
        </Modal.Header>
        <Container>
          <Row>
            <Form.Label>Select a quantity</Form.Label>
          </Row>
          <Row className="my-1 mb-3 px-3">
            <FormControl
              type="number"
              step={1}
              value={modalQuantity}
              onChange={(e) => setModalQuantity(e.target.value)}
              max={100}
              min={1}
            />
          </Row>
        </Container>
        <Modal.Footer>
          <Button className="btn-light" onClick={handleClose}>
            Close
          </Button>
          <Button className="btn-primary" onClick={() => addItem(modalProduct.id, modalQuantity)}>
            Submit
          </Button>
        </Modal.Footer>
      </Modal>

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
