import React from "react";
import { Container, Row } from "react-bootstrap";
import { employeeNavbarLinks } from "../Routes";
import { NavbarComponent } from "../ui-components/NavbarComponent/NavbarComponent";

import "bootstrap/dist/css/bootstrap.min.css";

function ClientManagementPage(props) {
  return (
    <Container>
      <Row>
        <NavbarComponent links={employeeNavbarLinks} />
      </Row>
      <Row>
        <h1>ClientManagementPage</h1>
      </Row>
    </Container>
  );
}

export { ClientManagementPage };
