import React from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import { routes, shoppingCartRouteName } from "../../Routes";
import { iconCartFill, iconLogo, iconCartEmpty, iconUser } from "../icons";
import "bootstrap/dist/css/bootstrap.min.css";
import "./NavbarComponent.css";

function NavbarComponent(props) {
  return (
    <>
      <Navbar className="navbar navbar-text" expand="sm" fixed="top">
        <Navbar.Brand
          href="/"
          className="d-flex justify-content-around align-items-center navbar-logo navbar-title"
        >
          {iconLogo}
          SPG
        </Navbar.Brand>
        <Navbar.Collapse>
          <Nav className="me-auto my-2 my-lg-0 ">
            {props.links?.map((routeName, i) => {
              const route = routes[routeName];
              return (
                <Nav.Link key={i} className="navbar-text" href={route.path}>
                  {route.linkTitle}
                </Nav.Link>
              );
            })}
          </Nav>
        </Navbar.Collapse>
        <Navbar.Toggle />

        {props.showShoppingCart && props.loggedUser && (
          <div className="navbar-logo d-flex justify-content-end ">
            {props.shoppingCartItems > 0 ? (
              <Link
                className="navbar-logo mx-1"
                to={{
                  pathname: routes[shoppingCartRouteName].path,
                  state: {
                    shoppingCart: props.shoppingCart,
                    clientID: props.clientID,
                  },
                }}
              >
                {iconCartFill}
              </Link>
            ) : (
              { iconCartEmpty }
            )}
          </div>
        )}

        {props.loggedUser && (
          <>
            {props.userIconLink ? (
              <Nav.Link
                className="navbar-text"
                href={routes[props.userIconLink]?.path}
              ></Nav.Link>
            ) : (
              { iconUser }
            )}
          </>
        )}
      </Navbar>
      <Container className="navbar-placeholder" />
    </>
  );
}

export { NavbarComponent };
