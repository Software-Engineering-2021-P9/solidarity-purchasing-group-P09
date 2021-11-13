import React from "react";
import { Container, Row } from "react-bootstrap";
import { employeeNavbarLinks } from "../Routes";
import { NavbarComponent } from "../ui-components/NavbarComponent/NavbarComponent";

import "bootstrap/dist/css/bootstrap.min.css";

function ProductListPage(props) {
  if (props.location.state != null) {
    console.log(props.location.state.cart);
  }

  return (
    <Container>
      <Row>
        <NavbarComponent
          links={employeeNavbarLinks}
          showShoppingCart
          shoppingCartItems="1"
        />
        {/*pass props.clientId*/}
      </Row>
      <Row>
        <h1>ProductListPage</h1>
      </Row>
      {/* this part is only for debug pruposes 
      {props.location.state != null ? (
        <>
          <Row>
            <p>
              I'm creating an order for the client with id:
              {props.location.state.clientId}{" "}
            </p>
          </Row>
        </>
      ) : (
        ""
      )} */}
    </Container>
  );
}

export { ProductListPage };
