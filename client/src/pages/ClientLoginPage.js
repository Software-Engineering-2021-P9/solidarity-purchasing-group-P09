import React, { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { employeeNavbarLinks } from "../Routes";

import { NavbarComponent } from "../ui-components/NavbarComponent/NavbarComponent";
import Validator from "validatorjs";
import "bootstrap/dist/css/bootstrap.min.css";
import { LoginForm } from "../ui-components/LoginFormComponent/LoginForm";
import { AskToRegister } from "../ui-components/LoginFormComponent/AskToRegister";
function ClientLoginPage(props) {
  const [username, setUsername] = useState("officer1");
  const [password, setPassword] = useState("officer1");
  const [errorMessage, setErrorMessage] = useState("");
  const [errorMessageType, setErrorMessageType] = useState("");
  const [reportErrorMessage, setReportErrorMessage] = useState("");

  let data = { username: username, password: password };
  let rules = {
    username: "required|alpha_num",
    password: "required|min:5",
  };
  let validation = new Validator(data, rules, {
    required: "Enter your :attribute",
    alpha_num: "Username must be alphanumeric",
    min: "Password must be at least of 6 characters",
  });

  const handleReset = (event) => {
    event.preventDefault();
    setErrorMessage("");
    setErrorMessageType("");
    setReportErrorMessage("");
    setUsername("");
    setPassword("");
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setErrorMessage("");
    setErrorMessageType("");
    setReportErrorMessage("");
    if (validation.passes()) {
      const credentials = { username, password };
      props.login(credentials).catch((err) => {
        setReportErrorMessage(err);
      });
    } else {
      if (validation.errors.first("username")) {
        setErrorMessage(validation.errors.first("username"));
        setErrorMessageType("username");
      } else {
        setErrorMessage(validation.errors.first("password"));
        setErrorMessageType("password");
      }
    }
  };
  return (
    <Container>
      <Row>
        <NavbarComponent links={employeeNavbarLinks} />
      </Row>
      <Row>
        <Col></Col>
        <Col>
          {" "}
          <LoginForm
            handleSubmit={handleSubmit}
            reportErrorMessage={reportErrorMessage}
            username={username}
            password={password}
            errorMessageType={errorMessageType}
            errorMessage={errorMessage}
            setUsername={setUsername}
            setPassword={setPassword}
            handleReset={handleReset}
          />
          <AskToRegister />
        </Col>
        <Col></Col>
      </Row>
    </Container>
  );
}

export { ClientLoginPage };
