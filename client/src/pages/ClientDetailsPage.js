import React, { useState } from "react";
import { Container, Row, Alert } from "react-bootstrap";
import { NavbarComponent } from "../ui-components/NavbarComponent/NavbarComponent";
import { CreateNewOrderButton } from "../ui-components/ClientDetailsComponent/CreateNewOrderButton";
import { employeeNavbarLinks } from "../Routes";
import { ClientOrders } from "../ui-components/ClientOrdersComponent/ClientOrders";

import "bootstrap/dist/css/bootstrap.min.css";

function ClientDetailsPage(props) {
  const [show, setShow] = useState(true);

  return (
    <Container>
      <Row>
        <NavbarComponent links={employeeNavbarLinks} />
      </Row>
      {props.location.state != null && show ? (
        <>
          <Row>
            <Alert variant="success" style={{color: "#635F46", fontWeight:"bold", backgroundColor:"#7465132f", width:"auto", marginTop:"1%", marginLeft:"1%"}} onClose={() => setShow(false)} dismissible>
              Your order was successfully created!
            </Alert>
          </Row>
        </>
      ) : ''}
      <Row>
        <h1>ClientDetailsPage</h1>
      </Row>
      <Row>
        <CreateNewOrderButton />
      </Row>
      <Row>
        <ClientOrders />
      </Row>
    </Container>
  );
}

export { ClientDetailsPage };
