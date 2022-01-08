import React, { useContext, useState } from "react";

import { useHistory } from "react-router";
import {
  employeeClientDetailsRouteName,
  employeeClientSignupRouteName,
  getAvailableNavbarLinks,
  routes,
} from "../../Routes";

import { Container, FormControl, InputGroup, Row, Col } from "react-bootstrap";

import { NavbarComponent } from "../../ui-components/NavbarComponent/NavbarComponent";
import ClientInfoList from "../../ui-components/ClientInfoList/ClientInfoList";
import Button from "../../ui-components/Button/Button";
import Divider from "../../ui-components/Divider/Divider";
import ErrorToast from "../../ui-components/ErrorToast/ErrorToast";

import "bootstrap/dist/css/bootstrap.min.css";
import "./ClientManagementPage.css";
import "../../ui-components/Title.css";

import { findClients } from "../../services/ApiClient";

import { AuthContext } from "../../contexts/AuthContextProvider";
import { RedDropdown } from "../../ui-components/RedDropdownComponent/RedDropdown";

function ClientManagementPage(props) {
  const history = useHistory();
  const authContext = useContext(AuthContext);

  const [searchString, setSearchString] = useState("");
  const [clientInfoList, setClientInfoList] = useState(null);
  const [isClientInfoListLoading, setIsClientInfoListLoading] = useState(false);
  const [requestError, setRequestError] = useState("");
  const [hasPendingCancelationFilter, setHasPendingCancelationFilter] =
    useState("All");

  function onPendingCancelationFilter(newVal) {
    setHasPendingCancelationFilter(newVal);
  }

  function onSearchClientButtonClick() {
    setIsClientInfoListLoading(true);

    let hasPendingCancelation;
    switch (hasPendingCancelationFilter) {
      case "Has Pending":
        hasPendingCancelation = true;
        break;

      case "Without Pending":
        hasPendingCancelation = false;
        break;

      default:
        hasPendingCancelation = null;
        break;
    }

    findClients(searchString, hasPendingCancelation)
      .then(setClientInfoList)
      .catch((err) => {
        setRequestError(err.message);
        setClientInfoList([]);
      })
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
    history.push(
      routes[employeeClientDetailsRouteName].path.replace(
        ":id",
        clientInfoList[index].id
      )
    );
  }

  function onCreateClientButtonClick(index) {
    history.push(routes[employeeClientSignupRouteName].path);
  }

  return (
    <>
      <NavbarComponent
        links={getAvailableNavbarLinks(authContext.currentUser)}
        loggedUser={authContext.currentUser}
      />
      <Row className="d-flex justify-content-between">
        <Col lg="auto" md="auto" sm="12" xs="12">
          <Row>
            <Col lg="auto" md="auto" sm="auto" xs="auto">
              <h1 className="title ">Manage Clients</h1>
            </Col>
            <Col className="w-auto margin-top-35">
              <Button className="p-1" onClick={onCreateClientButtonClick}>
                NEW CLIENT
              </Button>
            </Col>
          </Row>
        </Col>

        <Col className="margin-top" md="5" sm="12" xs="12">
          <InputGroup className="my-3">
            <FormControl
              placeholder="Mario Rossi"
              value={searchString}
              onChange={onSearchStringChange}
            />
            <Button onClick={onSearchClientButtonClick}>Search</Button>
          </InputGroup>
        </Col>

       

        
        <Col  className="dropdown-margin margin-top-35" xs="4" sm="3" md="2" lg="1">

          <RedDropdown
            items={["Has Pending", "Without Pending"]}
            title={
              hasPendingCancelationFilter ? hasPendingCancelationFilter : "All"
            }
            updateSelectedItem={onPendingCancelationFilter}
            activeElement={hasPendingCancelationFilter}
          />
        </Col>
      </Row>
      <Container>
        <Divider size={2} />
      </Container>
      <Row>
        <ClientInfoList
          isLoading={isClientInfoListLoading}
          clientInfoList={clientInfoList}
          onItemClick={onClientInfoListItemClick}
        />
      </Row>

      <ErrorToast
        onClose={() => setRequestError("")}
        errorMessage={requestError}
      />
    </>
  );
}

export { ClientManagementPage };
