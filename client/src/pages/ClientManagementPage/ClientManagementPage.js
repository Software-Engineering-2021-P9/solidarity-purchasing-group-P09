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
  const [coveredOrderFilter, setCoveredOrderFilter] = useState("All");

  function onCoveredOrderFilterChange(newVal) {
    setCoveredOrderFilter(newVal);
    onSearchClientButtonClick();
    //FOR THE REVIEWER: this is like pressing "search" button when selecting the filter "covered/notcovered/all"
    //might be ugly for someone, tell me in the review if I have to delete this.
  }

  function onSearchClientButtonClick() {
    setIsClientInfoListLoading(true);

    let hasNotCoveredOrders;
    switch(coveredOrderFilter){
      case("Covered"):
        hasNotCoveredOrders=true;
        break;

      case("Not Covered"):
       hasNotCoveredOrders=false;
        break;

      default:
        hasNotCoveredOrders = null;
        break;
    }

    findClients(searchString,hasNotCoveredOrders)
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
      <Row>
        <Col md='5'>
          <h1 className='title'>Manage Clients</h1>
        </Col>
        <Col className='pt-2'>
          <InputGroup className='my-3'>
            <FormControl
              placeholder='Mario Rossi'
              value={searchString}
              onChange={onSearchStringChange}
            />
            <Button onClick={onSearchClientButtonClick}>Search</Button>
          </InputGroup>
        </Col>
        <Col className='pb-3 pb-sm-0 my-4 dropdown-margin' xs='4' sm='3' md='2' lg='1'>
          <RedDropdown
              items={["Not Covered","Covered"]}
              title={coveredOrderFilter ? coveredOrderFilter : "All"}
              updateSelectedItem={onCoveredOrderFilterChange}
              activeElement={coveredOrderFilter}
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
      <Container className='client-management-page-bottom-space' />
      <Container className='d-flex position-fixed bottom-0 justify-content-end mb-4 '>
        <Button className='p-4' onClick={onCreateClientButtonClick}>
          Add a new client
        </Button>
      </Container>
      <ErrorToast
        onClose={() => setRequestError("")}
        errorMessage={requestError}
      />
    </>
  );
}

export { ClientManagementPage };
