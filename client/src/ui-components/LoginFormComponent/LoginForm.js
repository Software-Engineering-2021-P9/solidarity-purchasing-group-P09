import React from "react";
import { Form, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./LoginForm.css";

function LoginForm(props) {
  return (
    <Form onSubmit={props.handleSubmit} className="form-login">
      <Form.Group className="form-group">
        <h3>Login</h3>
        {props.reportErrorMessage !== "" ? (
          <div className="error-message">
            <i className="fas fa-exclamation-triangle"></i>{" "}
            {props.reportErrorMessage}
          </div>
        ) : (
          <></>
        )}
      </Form.Group>

      <Form.Group className="form-group" controlId="usernameForm">
        <Form.Label>Email/Phone</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter username"
          value={props.username}
          onChange={(ev) => props.setUsername(ev.target.value)}
        />
        {props.errorMessageType === "username" ? (
          <div className="error-message">
            <i className="fas fa-exclamation-triangle"></i> {props.errorMessage}
          </div>
        ) : (
          <></>
        )}
      </Form.Group>

      <Form.Group className="form-group" controlId="passwordForm">
        <Form.Label>Password</Form.Label>
        <Form.Control
          type="password"
          placeholder="Enter password"
          value={props.password}
          onChange={(ev) => props.setPassword(ev.target.value)}
        />
        {props.errorMessageType === "password" ? (
          <div className="error-message">
            <i className="fas fa-exclamation-triangle"></i> {props.errorMessage}
          </div>
        ) : (
          <></>
        )}
        <Link
          className="forgot-password"
          to="/#"
          onClick={(e) => e.preventDefault()}
        >
          Forgot your password?
        </Link>
      </Form.Group>

      <Form.Group className="form-group">
        <div>
          <Button
            className="button-login"
            type="submit"
            onClick={props.handleSubmit}
            variant="primary"
            size="lg"
          >
            Submit
          </Button>
          <Button
            className="button-reset"
            type="submit"
            onClick={props.handleReset}
            size="lg"
          >
            Reset
          </Button>
        </div>
      </Form.Group>
    </Form>
  );
}

export { LoginForm };
