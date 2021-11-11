import React from "react";
import { Container, Row } from "react-bootstrap";
import { NavbarComponent } from "../ui-components/NavbarComponent/NavbarComponent";

import "bootstrap/dist/css/bootstrap.min.css";

function ShoppingCartPage(props) {
  return (
    <Container>
      <Row>
        <NavbarComponent />
      </Row>
      <Row>
        <h1>ShoppingCartPage</h1>
      </Row>
    </Container>
  );
}

export { ShoppingCartPage };
