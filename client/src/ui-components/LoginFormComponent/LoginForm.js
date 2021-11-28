import React from "react";
import { Form, Row, Col, Alert } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./LoginForm.css";
import Button from "../Button/Button";

function LoginForm(props) {
  return (
    <Form onSubmit={props.handleSubmit} className="form-login">
      <Form.Group className="form-group">
        <h2>Login</h2>
        {props.errorMessage && (
          <Alert variant="danger">{props.errorMessage}</Alert>
        )}{" "}
      </Form.Group>
      <h5 className="credentials">Credentials</h5>
      <Form.Group className="form-group" controlId="usernameForm">
        <Form.Label>Email/Phone</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter username"
          value={props.username}
          onChange={(ev) => props.setUsername(ev.target.value)}
        />
      </Form.Group>

      <Form.Group className="form-group" controlId="passwordForm">
        <Form.Label>Password</Form.Label>
        <Form.Control
          type="password"
          placeholder="Enter password"
          value={props.password}
          onChange={(ev) => props.setPassword(ev.target.value)}
        />

        <Link
          className="forgot-password"
          to="/#"
          onClick={(e) => e.preventDefault()}
        >
          Forgot your password?
        </Link>
      </Form.Group>

      <Form.Group className="form-group">
        <Row>
          <Col>
            <Button className="btn-primary" onClick={props.handleSubmit}>
              Submit
            </Button>
            <span></span>
            <Button className="btn-light" onClick={props.handleReset}>
              Reset
            </Button>
          </Col>
        </Row>
      </Form.Group>
    </Form>
  );
}

export { LoginForm };
