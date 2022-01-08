import React from "react";
import { Form, Row, Col, Alert } from "react-bootstrap";
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

      <Form.Group className="form-group" controlId="usernameForm">
        <Form.Label>Email</Form.Label>
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
      </Form.Group>

      <Form.Group className="form-group">
        <Row>
          <Col>
            <Button className="btn-primary" onClick={props.handleSubmit}>
              Submit
            </Button>
          </Col>
        </Row>
      </Form.Group>
    </Form>
  );
}

export { LoginForm };
