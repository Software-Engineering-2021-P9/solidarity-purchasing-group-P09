import React, { useContext, useState } from "react";
import { Container, Row, Alert } from "react-bootstrap";
import { NavbarComponent } from "../ui-components/NavbarComponent/NavbarComponent";
import { AuthContext } from "../contexts/AuthContextProvider";
import "bootstrap/dist/css/bootstrap.min.css";

function ManagerOrdersStatsPage(props) {
  return (
    <Container>
      <Row>
        <NavbarComponent links={[]} />
      </Row>
      <Row>
        <h1>Manager page</h1>
      </Row>
    </Container>
  );
}

export { ManagerOrdersStatsPage };
