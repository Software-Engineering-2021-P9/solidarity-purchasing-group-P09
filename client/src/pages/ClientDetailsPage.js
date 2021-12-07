import React, { useContext, useEffect, useState } from "react";

import { useHistory, useParams, useLocation } from "react-router";
import { getAvailableNavbarLinks } from "../Routes";

import {
  Col,
  Container,
  FormControl,
  InputGroup,
  Row,
  Spinner,
  Alert,
} from "react-bootstrap";

import ActionConfirmationModal from "../ui-components/ActionConfirmationModal/ActionConfirmationModal";
import Button from "../ui-components/Button/Button";
import ClientDetails from "../ui-components/ClientDetails/ClientDetails";
import { ClientOrders } from "../ui-components/ClientOrdersComponent/ClientOrders";
import Divider from "../ui-components/Divider/Divider";
import ErrorToast from "../ui-components/ErrorToast/ErrorToast";
import { NavbarComponent } from "../ui-components/NavbarComponent/NavbarComponent";
import { CreateNewOrderButton } from "../ui-components/ClientDetailsComponent/CreateNewOrderButton";

import { addFundToWallet, getClientByID } from "../services/ApiClient";

import { AuthContext } from "../contexts/AuthContextProvider";

import "bootstrap/dist/css/bootstrap.min.css";
import "../ui-components/Title.css";
import UserRoles from "../services/models/UserRoles";

const positiveFloatRegex = /^[+]?([0-9]+(?:[.][0-9]{0,2})?|\.[0-9]{1,2})$/;

function ClientDetailsPage(props) {
  const params = useParams();

  const [show, setShow] = useState(true);

  const history = useHistory();
  const location = useLocation();
  const authContext = useContext(AuthContext);

  const clientID = params.id || authContext.currentUser.id;

  const [isInitialized, setIsInitialized] = useState(false);
  const [mustReload, setMustReload] = useState(false);
  const [requestError, setRequestError] = useState("");

  const [clientInfo, setClientInfo] = useState(null);
  const [fundsToAddAmount, setFundsToAddAmount] = useState("");

  const [actionConfirmationModalMessage, setActionConfirmationModalMessage] =
    useState("");
  const [actionConfirmationModalCallback, setActionConfirmationModalCallback] =
    useState(null);
  const [isActionLoading, setIsActionLoading] = useState(false);

  useEffect(() => {
    if (!clientID) {
      history.push("/");
    }

    const getClientInfo = () => {
      getClientByID(clientID)
        .then((result) => {
          setClientInfo(result);
          setIsInitialized(true);
          setMustReload(false);
        })
        .catch((err) =>
          setRequestError("Failed to fetch client data: " + err.message)
        );
    };
    getClientInfo();
  }, [clientID, history, mustReload]);

  function onFundsToAddAmountChange(event) {
    const newVal = event.target.value;

    if (newVal === "" || newVal.match(positiveFloatRegex)) {
      setFundsToAddAmount(newVal);
      return;
    }
  }

  function onAddFundsToWalletButtonClick() {
    if (!fundsToAddAmount) return;
    const fundsToAddFloat = Number(parseFloat(fundsToAddAmount).toFixed(2));
    setActionConfirmationModalMessage(
      `Are you sure you want to increase the wallet value of the client by ${fundsToAddFloat}€? The final wallet value will be ${Number(
        fundsToAddFloat + clientInfo.wallet
      ).toFixed(2)}€`
    );
    setActionConfirmationModalCallback(() => () => {
      setIsActionLoading(true);
      addFundToWallet(clientID, fundsToAddFloat)
        .catch((err) =>
          setRequestError("Failed to increase client wallet: " + err.message)
        )
        .finally(() => {
          setMustReload(true);
          setIsActionLoading(false);
          onActionConfirmationModalHide();
        });
    });
  }

  function onActionConfirmationModalHide() {
    setActionConfirmationModalMessage("");
    setActionConfirmationModalCallback(null);
  }

  return (
    <>
      <NavbarComponent
        links={getAvailableNavbarLinks(authContext.currentUser)}
        loggedUser={authContext.currentUser}
        userIconLink={authContext.getUserIconLink()}
      />
      {location.state != null && show ? (
        <Row>
          <Alert
            variant='success'
            style={{
              color: "#635F46",
              fontWeight: "bold",
              backgroundColor: "#7465132f",
              width: "auto",
              marginTop: "1%",
              marginLeft: "1%",
            }}
            onClose={() => setShow(false)}
            dismissible>
            {authContext.currentUser.role === UserRoles.CLIENT &&
              "Your order was successfully created"}
            {authContext.currentUser.role === UserRoles.EMPLOYEE &&
              `${clientInfo?.fullName}'s order was successfully created!`}
          </Alert>
        </Row>
      ) : (
        ""
      )}

      {!isInitialized ? (
        <Container className='pt-5 d-flex justify-content-center'>
          <Spinner variant='dark' animation='border' />
        </Container>
      ) : (
        <>
          <Row>
            <h1 className='title'>Client Details</h1>
          </Row>
          <Row className='justify-content-around pt-2'>
            <Col className='ms-5'>
              <ClientDetails clientInfo={clientInfo} />
            </Col>
            {authContext.currentUser.role === UserRoles.EMPLOYEE && (
              <Col md='5'>
                <InputGroup className='mb-3 pt-4'>
                  <FormControl
                    placeholder='50€'
                    value={fundsToAddAmount}
                    onChange={onFundsToAddAmountChange}
                    required
                  />
                  <Button onClick={onAddFundsToWalletButtonClick}>
                    Add funds
                  </Button>
                </InputGroup>
              </Col>
            )}
          </Row>
          {authContext.currentUser.role === UserRoles.EMPLOYEE && (
            <Row className='my-3'>
              <CreateNewOrderButton clientID={clientID} />
            </Row>
          )}

          <Container>
            <Divider size={2} />
          </Container>
          <Row>
            <ClientOrders clientID={clientID}/>
          </Row>
        </>
      )}

      <ErrorToast
        errorMessage={requestError}
        onClose={() => setRequestError("")}
      />
      <ActionConfirmationModal
        show={actionConfirmationModalMessage}
        onHide={onActionConfirmationModalHide}
        message={actionConfirmationModalMessage}
        onConfirm={actionConfirmationModalCallback}
        onCancel={onActionConfirmationModalHide}
        isLoading={isActionLoading}
      />
    </>
  );
}

export { ClientDetailsPage };
