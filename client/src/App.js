import React, { useState } from "react";
import { Container, Row, Col, Alert, Button, Spinner } from "react-bootstrap";
import { getEmployeeByID } from "./services/ApiClient";

function App() {
  const [employee, setEmployee] = useState({});
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  function onButtonClick() {
    setIsLoading(true);
    getEmployeeByID("6187c957b288576ca26f8257")
      .then((employee) => setEmployee(employee))
      .catch((err) => setError(err))
      .finally(() => setIsLoading(false));
  }

  return (
    <Container>
      <Row className='vh-100 justify-content-center align-items-center'>
        <Col className='d-flex justify-content-center align-items-center flex-column'>
          {isLoading ? (
            <Spinner animation='border' variant='primary' />
          ) : (
            <>
              <Button onClick={onButtonClick}>Get an employee name!</Button>
              <h1>{employee.fullName}</h1>
              {error ? <Alert>{error}</Alert> : null}
            </>
          )}
        </Col>
      </Row>
    </Container>
  );
}

export default App;
