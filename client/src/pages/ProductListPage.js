import { React, useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Dropdown,
  Form,
  Button,
  CardGroup,
  FormControl,
  DropdownButton,
} from "react-bootstrap";
import { employeeNavbarLinks } from "../Routes";
import { NavbarComponent } from "../ui-components/NavbarComponent/NavbarComponent";
import Product from "../services/models/Product";
import ProductCard from "../ui-components/ProductCard";
import {
  RedButton,
  RedButtonDropDown,
} from "../ui-components/Red Button Component/RedButton";

import "bootstrap/dist/css/bootstrap.min.css";

function ProductListPage(props) {
  /* TODO: Retrieve this products from back-end*/
  const [products, setProducts] = useState([
    new Product(1, "giovanni", "Zucchini", "Origin: Italy", "vegetables"),
    new Product(2, "Luca", "Bananas", "Origin: Italy", "vegetables"),
    new Product(3, "Luca", "Bananas", "Origin: Italy", "vegetables"),
    new Product(4, "Luca", "Bananas", "Origin: Italy", "vegetables"),
    new Product(5, "Luca", "Bananas", "Origin: Italy", "vegetables"),
  ]);

  //used for storing the content of the search form
  const [text, setText] = useState();

  //updated when selected a new category
  const [category, setCategory] = useState();

  //updated only when clicked on search
  const [searcString, setSearchString] = useState();

  useEffect(() => {
    //call from props the function for fetching the new products
    console.log("get new products");
  }, [category, searcString]);

  const handleOnSearchSubmit = () => {
    //update searchString, this way useEffect is called
    setSearchString(text);
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
          <h1>Available products</h1>
        </Row>
        <Row>
          <Col>
            <RedButtonDropDown
              items={Object.values(Product.Categories)}
              title={"Categories"}
              updateSelectedItem={handleCategoryChanged}
              activeElement={category}
            />
          </Col>

          <Col>
            <Form>
              <Row>
                <Col>
                  <FormControl
                    type="text"
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
        <hr />
        <Row md={4} xs={2} className="g-4">
          {products.map((item) => {
            return (
              <CardGroup as={Col}>
                <ProductCard product={item} />
              </CardGroup>
            );
          })}
        </Row>
      </Row>
    </Container>
  );
}

export { ProductListPage };
