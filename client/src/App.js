import React from "react";
import { Container, Row } from "react-bootstrap";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";
import { AuthContextProvider } from "./contexts/AuthContextProvider";
import { routes } from "./Routes";

function App() {
  return (
    <Router>
      <AuthContextProvider>
        <Container fluid>
          <Row className="justify-content-center align-items-center">
            <Switch>
              {Object.values(routes).map((route, i) => (
                <Route
                  key={i}
                  exact={route.exact}
                  path={route.path}
                  component={route.component}
                />
              ))}

              <Route path="/">
                <Redirect to="/" />
              </Route>
            </Switch>
          </Row>
        </Container>
      </AuthContextProvider>
    </Router>
  );
}

export default App;
