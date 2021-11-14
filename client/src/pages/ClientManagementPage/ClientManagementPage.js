import React, { useState } from "react";
import {
  Container,
  FormControl,
  InputGroup,
  Row,
  Col,
  Toast,
  ToastContainer,
} from "react-bootstrap";
import { employeeNavbarLinks } from "../../Routes";
import { NavbarComponent } from "../../ui-components/NavbarComponent/NavbarComponent";
import ClientInfoList from "../../ui-components/ClientInfoList/ClientInfoList";
import Button from "../../ui-components/Button/Button";
import Divider from "../../ui-components/Divider/Divider";

import "bootstrap/dist/css/bootstrap.min.css";
import "./ClientManagementPage.css";
import { findClients } from "../../services/ApiClient";

function ClientManagementPage(props) {
  const [searchString, setSearchString] = useState("");
  const [isClientInfoListLoading, setIsClientInfoListLoading] = useState(false);
  const [searchClientError, setSearchClientError] = useState("");
  const [clientInfoList, setClientInfoList] = useState([
    {
      fullName: "Pippo Peppe",
      address: "Via dei drogati 7",
      phoneNumber: "12323232323",
      wallet: 50.0,
    },
    {
      fullName: "Pippe Peppo",
      address: "Via dei drogati 7",
      phoneNumber: "12323232323",
      wallet: 50.0,
    },
  ]);

  function onSearchClientButtonClick() {
    setIsClientInfoListLoading(true);
    findClients(searchString)
      .then(setClientInfoList)
      .catch((err) => setSearchClientError(err.message))
      .finally(() => setIsClientInfoListLoading(false));
  }

  function onSearchStringChange(event) {
    const newVal = event.target.value;

    if (newVal.trim() === "") {
      setSearchString("");
      return;
    }
    if (newVal !== searchString) setSearchString(newVal);
  }

  function onClientInfoListItemClick(index) {
    console.log(clientInfoList[index].fullName);
  }

  function onCreateClientButtonClick(index) {
    console.log("new client");
  }

  return (
    <>
      <Container>
        <NavbarComponent links={employeeNavbarLinks} />
        <Row className='position-relative pt-4'>
          <Col md='5'>
            <h1>Manage Clients</h1>
          </Col>
          <Col>
            <InputGroup className='mb-3'>
              <FormControl
                placeholder='Mario Rossi'
                value={searchString}
                onChange={onSearchStringChange}
              />
              <Button onClick={onSearchClientButtonClick}>Search</Button>
            </InputGroup>
          </Col>
        </Row>
        <Divider size={2} />
        <Row>
          <ClientInfoList
            isLoading={isClientInfoListLoading}
            clientInfoList={clientInfoList}
            onItemClick={onClientInfoListItemClick}
          />
        </Row>
        <Container className='client-management-page-bottom-space' />
        <Container className='d-flex position-fixed bottom-0 justify-content-end mb-4 '>
          <Button className='p-4' onClick={onCreateClientButtonClick}>
            Add a new client
          </Button>
        </Container>
      </Container>
      {searchClientError && (
        <ToastContainer position='bottom-start' className='p-3'>
          <Toast autohide onClose={() => setSearchClientError("")}>
            <Toast.Header>
              <strong>Error</strong>
            </Toast.Header>
            <Toast.Body>{searchClientError}</Toast.Body>
          </Toast>
        </ToastContainer>
      )}
    </>
  );
}

export { ClientManagementPage };
