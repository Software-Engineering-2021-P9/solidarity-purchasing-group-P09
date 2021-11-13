import { React, useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  CardGroup,
  FormControl,
} from "react-bootstrap";
import { employeeNavbarLinks } from "../Routes";
import { NavbarComponent } from "../ui-components/NavbarComponent/NavbarComponent";
import Product from "../services/models/Product";
import ProductCard from "../ui-components/ProductListpageComponents/ProductCard";
import { RedButton } from "../ui-components/ProductListpageComponents/RedButtonComponent/RedButton";
import { RedDropdown } from "../ui-components/ProductListpageComponents/RedDropdownComponent/RedDropdown";

import "../ui-components/ProductListpageComponents/Title.css";
import "bootstrap/dist/css/bootstrap.min.css";

import { findProducts } from "../services/ApiClient";

function ProductListPage(props) {
  const [products, setProducts] = useState([]);

  //used for storing the content of the search form
  const [text, setText] = useState();

  //updated when selected a new category
  const [category, setCategory] = useState();

  //updated only when clicked on search
  const [searcString, setSearchString] = useState();

  async function updateProducts(category, searcString) {
    try {
      const fromServer = await findProducts(category, searcString);
      setProducts(fromServer);
    } catch (err) {
      console.error(`findProducts() -> couldn't retrieve products: ${err}`);
    }
  }

  useEffect(() => {
    //call from props the function for fetching the new products
    updateProducts(category, searcString);
  }, [category, searcString]);

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

  return (
    <Container>
      <Row>
        <NavbarComponent
          links={employeeNavbarLinks}
          showShoppingCart
          shoppingCartItems="1"
        />
      </Row>

      <Row fluid>
        <Row>
          <h1 className="title">Available products</h1>
        </Row>
        <Row>
          <Col>
            <RedDropdown
              items={Object.values(Product.Categories)}
              title={category ? category : "Categories"}
              updateSelectedItem={handleCategoryChanged}
              activeElement={category}
            />
          </Col>

          <Col>
            <Form onSubmit={(ev) => handleFormSubmit(ev)}>
              <Row>
                <Col>
                  <FormControl
                    type="textarea"
                    placeholder="Filter"
                    value={text}
                    onChange={(ev) => setText(ev.target.value)}
                  />
                </Col>
                <Col>
                  <RedButton text="Search" onClick={handleOnSearchSubmit} />
                </Col>
              </Row>
            </Form>
          </Col>
        </Row>
        <hr className="line" />
        <Row md={4} xs={2} className="g-4">
          {products
            ? products.map((item) => {
                return (
                  <CardGroup as={Col}>
                    <ProductCard product={item} />
                  </CardGroup>
                );
              })
            : {}}
        </Row>
      </Row>
    </Container>
  );
}

export { ProductListPage };
