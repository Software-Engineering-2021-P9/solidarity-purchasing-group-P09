import React from "react";
import { Container, Row } from "react-bootstrap";
import { NavbarComponent } from "../ui-components/NavbarComponent/NavbarComponent";
import { CreateNewOrderButton } from "../ui-components/ClientDetailsComponent/CreateNewOrderButton";
import { employeeNavbarLinks } from "../Routes";

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
      {/* this part is only for debug pruposes 
      { props.location.state != null ? (
        <>
          <Row>
            <p>
              Order is recorded to database!! Client with id:
              {props.location.state.clientId}{" "}
            </p>
          </Row>
          <Row>
            <CreateNewOrderButton clientId={props.location.state.clientId} />
          </Row>
        </>
      ) : (
        <Row>
          <CreateNewOrderButton />
      </Row>
       )} */}
      <Row>
        <CreateNewOrderButton />
      </Row>
    </Container>
  );
}

export { ClientDetailsPage };
