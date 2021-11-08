import React, { useState } from "react";
import { Container, Row, Col, Alert, Button, Spinner } from "react-bootstrap";
import ProductListPage from "./ProductListPage";
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
     <ProductListPage />
    </Container>
  );
}

export default App;
