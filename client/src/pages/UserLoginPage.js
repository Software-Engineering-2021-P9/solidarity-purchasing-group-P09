import React, { useContext, useState } from "react";
import Validator from "validatorjs";
import { Container, Row, Col, Alert } from "react-bootstrap";
import { Link } from "react-router-dom";
import { LoginForm } from "../ui-components/LoginFormComponent/LoginForm";
import { AskToRegister } from "../ui-components/LoginFormComponent/AskToRegister";
import { NavbarComponent } from "../ui-components/NavbarComponent/NavbarComponent";
import { AuthContext } from "../contexts/AuthContextProvider";
import "bootstrap/dist/css/bootstrap.min.css";

function UserLoginPage(props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  let data = { username: username, password: password };
  let rules = {
    username: "required",
    password: "required|min:5",
  };
  let validation = new Validator(data, rules, {
    required: "Enter your :attribute",
    alpha_num: "Username must be alphanumeric",
    min: "Password must be at least of 6 characters",
  });
  const authContext = useContext(AuthContext);

  const handleReset = (event) => {
    event.preventDefault();
    setErrorMessage("");
    setUsername("");
    setPassword("");
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setErrorMessage("");
    if (validation.passes()) {
      authContext.loginUser(username, password).catch((err) => {
        setErrorMessage("Your credentials are wrong!");
      });
    } else {
      if (validation.errors.first("username")) {
        setErrorMessage(validation.errors.first("username"));
      } else {
        setErrorMessage(validation.errors.first("password"));
      }
    }
  };

  function onLogout() {
    authContext.logoutUser();
  }

  return (
    <Container>
      <Row>
        <NavbarComponent links={[]} />
      </Row>

      {authContext.currentUser ? (
        <Row className="pb-5">
          <Alert variant="danger" style={{ margin: "30px" }}>
            {" "}
            Hi, {authContext.currentUser.fullName}! You are already logged as a{" "}
            {authContext.currentUser.role}. Please logout from{" "}
            <Link to="#" onClick={onLogout} style={{ color: "#c48566" }}>
              here!
            </Link>
          </Alert>
        </Row>
      ) : (
        <Row>
          <Col>
            <LoginForm
              handleSubmit={handleSubmit}
              username={username}
              password={password}
              errorMessage={errorMessage}
              setUsername={setUsername}
              setPassword={setPassword}
              handleReset={handleReset}
            />
            <AskToRegister />
          </Col>
          <Col xs lg="3"></Col>
        </Row>
      )}
    </Container>
  );
}

export { UserLoginPage };
