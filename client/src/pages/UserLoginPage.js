import React, { useContext, useState } from "react";

import { Alert, Container, Row } from "react-bootstrap";

import { NavbarComponent } from "../ui-components/NavbarComponent/NavbarComponent";
import Button from "../ui-components/Button/Button";

import { AuthContext } from "../contexts/AuthContextProvider";

import "bootstrap/dist/css/bootstrap.min.css";

function UserLoginPage(props) {
  const authContext = useContext(AuthContext);

  const [errorMessage, setErrorMessage] = useState("");

  function onClientLogin() {
    authContext
      .loginUser("client@test.com", "123456789")
      .catch(setErrorMessage);
  }
  function onEmployeeLogin() {
    authContext
      .loginUser("employee@test.com", "123456789")
      .catch(setErrorMessage);
  }
  function onFarmerLogin() {
    authContext
      .loginUser("farmer@test.com", "123456789")
      .catch(setErrorMessage);
  }

  function onLogout() {
    authContext.logoutUser();
  }

  return (
    <Container>
      <Row>
        <NavbarComponent links={[]} />
      </Row>
      <Row>
        <h1>UserLoginPage</h1>
      </Row>
      {authContext.currentUser && (
        <Row className='pb-5'>
          Hi, {authContext.currentUser.fullName}! You are already logged as a{" "}
          {authContext.currentUser.role}!
          <Button onClick={onLogout}>Logout</Button>
        </Row>
      )}
      <Row className='pb-2'>
        <Button onClick={onClientLogin}>Login Client</Button>
      </Row>
      <Row className='pb-2'>
        <Button onClick={onEmployeeLogin}>Login Employee</Button>
      </Row>
      <Row className='pb-2'>
        <Button onClick={onFarmerLogin}>Login Farmer</Button>
      </Row>

      <Row></Row>

      {errorMessage && <Alert variant='danger'>{errorMessage}</Alert>}
    </Container>
  );
}

export { UserLoginPage };
