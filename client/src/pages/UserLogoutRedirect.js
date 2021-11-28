import React, { useContext, useEffect } from "react";
import { useHistory } from "react-router";

import { Row, Spinner } from "react-bootstrap";

import { AuthContext } from "../contexts/AuthContextProvider";

import "bootstrap/dist/css/bootstrap.min.css";

function UserLogoutRedirect(props) {
  const authContext = useContext(AuthContext);
  const history = useHistory();

  useEffect(() => {
    authContext.logoutUser();
    history.push("/");
  }, [authContext, history]);

  return (
    <Row className='vh-100 justify-content-center align-content-center'>
      <Spinner animation='border' />
    </Row>
  );
}

export { UserLogoutRedirect };
