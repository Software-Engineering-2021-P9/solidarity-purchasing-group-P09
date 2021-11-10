import React from "react";
import { Container, Row} from "react-bootstrap";
//import { getEmployeeByID } from "./services/ApiClient";
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';

import { NavbarComponent } from "./ui-components/NavbarComponent";
import { ShoppingCartPage } from "./pages/ShoppingCartPage";
import { ClientDetailsPage } from "./pages/ClientDetailsPage";
import { ClientManagementPage } from "./pages/ClientManagementPage";
import { ClientRegistrationPage } from "./pages/ClientRegistrationPage";
import { OrdersPage } from "./pages/OrdersPage";
import { ProducutListPage } from "./pages/ProductListPage";
import { NewOrderPage } from "./pages/NewOrderPage";


function App() {

  function getProductById(id){
    var price = Math.floor(Math.random() * (10 - 0 + 1) + 0);
    const product = {id:id, item:"Eggplant", price:price};
    return 
  }
  
  /*const [employee, setEmployee] = useState({});
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  function onButtonClick() {
    setIsLoading(true);
    getEmployeeByID("6187c957b288576ca26f8257")
      .then((employee) => setEmployee(employee))
      .catch((err) => setError(err))
      .finally(() => setIsLoading(false));
  }*
  
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
  ); */

  return (
    <Router>
      <Container>
        <Row>
          <NavbarComponent cart={1}/>   
          {/*cart prop receives the length of the items list in shopping cart */}
        </Row>
        <Row className='vh-100 justify-content-center align-items-center'>
          <Switch>
            <Route exact path="/">
              <ProducutListPage/>
            </Route>
            <Route exact path="/cart">
              <ShoppingCartPage client={"Giuseppe"} getProductById={getProductById}/> 
              {/* this prop should be pass by ClientDetailsPage when "add new order button is clicked" */}
            </Route>
            <Route exact path="/orders">
              <OrdersPage/> 
            </Route>
            <Route exact path="/clients">
              <ClientManagementPage/>
            </Route>
            <Route exact path="/clients/:id">
              <ClientDetailsPage/>
            </Route>
            <Route exact path="/neworder">
              <NewOrderPage/> {/* = ProductListPage in creating an order mode */}
            </Route>
            <Route exact path="/newclient">
              <ClientRegistrationPage/>
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
