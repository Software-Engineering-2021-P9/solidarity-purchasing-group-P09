import React from "react";
import { Container, Row } from "react-bootstrap";
import { employeeNavbarLinks } from "../Routes";
import { NavbarComponent } from "../ui-components/NavbarComponent/NavbarComponent";

import "bootstrap/dist/css/bootstrap.min.css";

function ProductListPage(props) {
  return (
    <Container>
      <Row>
        <NavbarComponent
          links={employeeNavbarLinks}
          showShoppingCart
          shoppingCartItems='1'
        />
      </Row>
      <Row>
        <h1>ProductListPage</h1>
      </Row>
    </Container>
  );
}

export { ProductListPage };
