import React from "react";
import { Container, Row} from "react-bootstrap";
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';

import { ShoppingCartPage } from "./pages/ShoppingCartPage";
import { ClientDetailsPage } from "./pages/ClientDetailsPage";
import { ClientManagementPage } from "./pages/ClientManagementPage";
import { ClientSignupPage } from "./pages/ClientSignupPage";
import { ProductListPage } from "./pages/ProductListPage";

function App() {

  return (
    <Router>
      <Container>
        <Row className='vh-100 justify-content-center align-items-center'>
          <Switch>
          <Route exact path="/">
              <ProductListPage/>
            </Route>
            <Route exact path="/currentCart">
              <ShoppingCartPage/> 
            </Route>
            <Route exact path="/clients">
              <ClientManagementPage/>
            </Route>
            <Route exact path="/clients/:id">
              <ClientDetailsPage/>
            </Route>
            <Route exact path="/newclient">
              <ClientSignupPage/>
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
