import React, { useContext } from "react";
import { Row, Container } from "react-bootstrap";
import { NavbarComponent } from "../ui-components/NavbarComponent/NavbarComponent";

import "bootstrap/dist/css/bootstrap.min.css";

import { getAvailableNavbarLinks } from "../Routes";
import { AuthContext } from "../contexts/AuthContextProvider";

function ManagerOrdersStatsPage(props) {
  const authContext = useContext(AuthContext);

  return (
    <Container>
      <Row>
        <NavbarComponent
          links={getAvailableNavbarLinks(authContext.currentUser)}
          loggedUser={authContext.currentUser}
          userIconLink={authContext.getUserIconLink()}
        />
      </Row>
      <Row>
        <h1>ManagerOrdersStatsPage</h1>
      </Row>
    </Container>
  );
}

export { ManagerOrdersStatsPage };
