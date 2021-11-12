import { React, useState } from "react";
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

  const [ids,setIds]=useState();
  const [category, setCategory]= useState();
  const [searcString, setSearchString]= useState();

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
              onClick={}
            />
          </Col>

          <Col>
            <Form>
              <Row>
                <Col>
                  <FormControl type="text" placeholder="Filter" />
                </Col>
                <Col>
                  <RedButton text="Search" />
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
