import React from "react";
import { Container, Row } from "react-bootstrap";
import { NavbarComponent } from "../ui-components/NavbarComponent/NavbarComponent";
import { employeeNavbarLinks } from "../Routes";
import { ClientOrders } from "../ui-components/ClientOrdersComponent/ClientOrders";

import "bootstrap/dist/css/bootstrap.min.css";

function ClientDetailsPage(props) {
  return (
    <Container>
      <Row>
        <NavbarComponent links={employeeNavbarLinks} />
      </Row>
      <Row>
        <h1>ClientDetailsPage</h1>
      </Row>
      <Row>
        <ClientOrders />
      </Row>
    </Container>
  );
}

export { ClientDetailsPage };
