import React from "react";
import { Container, Row} from "react-bootstrap";
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
    var price = Math.floor(Math.random() * (1000 - 100) + 100) / 100;
    const product = {id:id, item:"Eggplant", price:price};
    return product; 
  }


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
