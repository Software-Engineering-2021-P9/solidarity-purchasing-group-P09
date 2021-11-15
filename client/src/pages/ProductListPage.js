import { React, useEffect, useState } from "react";
import { Row, Col, Form, CardGroup, FormControl } from "react-bootstrap";
import { employeeNavbarLinks } from "../Routes";
import { NavbarComponent } from "../ui-components/NavbarComponent/NavbarComponent";
import Product from "../services/models/Product";
import ProductCard from "../ui-components/ProductCardComponent/ProductCard";
import { RedButton } from "../ui-components/RedButtonComponent/RedButton";
import { RedDropdown } from "../ui-components/RedDropdownComponent/RedDropdown";

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

  return (
    <>
      <NavbarComponent
        links={employeeNavbarLinks}
        showShoppingCart
        shoppingCartItems='1'
      />

      <Row className='align-items-center'>
        <h1 className='title'>Available products</h1>
      </Row>
      <Row className='sticky '>
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
                  type='textarea'
                  placeholder='Filter'
                  value={text}
                  onChange={(ev) => setText(ev.target.value)}
                />
              </Col>
              <Col xs={{ span: 1, offset: 1 }}>
                <RedButton text='Search' onClick={handleOnSearchSubmit} />
              </Col>
            </Row>
          </Form>
        </Col>
        <hr className='line' />
      </Row>

      <Row md={4} xs={2} className='g-4'>
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
    </>
  );
}

export { ProductListPage };
