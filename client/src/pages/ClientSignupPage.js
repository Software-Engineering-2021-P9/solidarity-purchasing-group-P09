import React from "react";
import { Container, Row } from "react-bootstrap";
import { NavbarComponent } from "../ui-components/NavbarComponent/NavbarComponent";

import "bootstrap/dist/css/bootstrap.min.css";

function ClientSignupPage(props) {
  return (
    <Container>
      <Row>
        <NavbarComponent links={[]} />
      </Row>
      <Row>
        <h1>ClientSignupPage</h1>
      </Row>
    </Container>
  );
}

export { ClientSignupPage };
