import React, { useState } from "react";
import { Container, Row, Col, Alert, Button, Spinner } from "react-bootstrap";
import { getEmployeeByID } from "./services/ApiClient";
import { NavbarComponent } from "./ui-components/NavbarComponent";
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';

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
    <Router>
      <Container>
        <Row>
          <NavbarComponent cart={1} userType={1} />   
          {/*cart prop receives the length of the items list in shopping cart
          userType prop receives 0 if the user is an employee, 1 a client */}
        </Row>
        <Row className='vh-100 justify-content-center align-items-center'>

          <Switch>
            <Route exact path="/">
              <h1>ProductListPage</h1>
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
            </Route>
            <Route exact path="/cart">
              <h1>ShoppingCartPage</h1>
            </Route>
            <Route exact path="/orders">
              <h1>OrdersPage</h1>
            </Route>
            <Route exact path="/clients">
              <h1>ClientsManagementPage</h1>
            </Route>
            <Route exact path="/clients/:id">
              <h1>ClientDetailspage</h1>
            </Route>
            <Route exact path="/neworder">
              <h1>New order page</h1>
            </Route>
            <Route exact path="/newclient">
              <h1>ClientRegistrationPage</h1>
            </Route>
            <Route exact path="/login">
              <h1>LoginPage</h1>
            </Route>
            <Route path="/">
              <Redirect to="/" />
            </Route>

          </Switch>
        </Row>
      </Container>
    </Router>

  );
}

export default App;
