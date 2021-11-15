import React, { useEffect, useState } from "react";

import { useHistory, useParams } from "react-router";
import { employeeNavbarLinks } from "../Routes";

import {
  Col,
  Container,
  FormControl,
  InputGroup,
  Row,
  Spinner,
} from "react-bootstrap";
import ActionConfirmationModal from "../ui-components/ActionConfirmationModal/ActionConfirmationModal";
import Button from "../ui-components/Button/Button";
import ClientDetails from "../ui-components/ClientDetails/ClientDetails";
import Divider from "../ui-components/Divider/Divider";
import ErrorToast from "../ui-components/ErrorToast/ErrorToast";
import { NavbarComponent } from "../ui-components/NavbarComponent/NavbarComponent";

import { addFundToWallet, getClientByID } from "../services/ApiClient";

import "bootstrap/dist/css/bootstrap.min.css";
import "../ui-components/Title.css";

function ClientDetailsPage(props) {
  const params = useParams();
  const clientID = params.id;

  const history = useHistory();

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
    if (newVal.match(/\d+\.\d*|\.?\d+|/)) setFundsToAddAmount(newVal);
  }

  function onAddFundsToWalletButtonClick() {
    if (!fundsToAddAmount) return;
    const fundsToAddFloat = parseFloat(fundsToAddAmount);
    setActionConfirmationModalMessage(
      `Are you sure you want to increase the wallet value of the client by ${fundsToAddFloat}€? The final wallet value will be ${
        fundsToAddFloat + clientInfo.wallet
      }€`
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
      <Container>
        <NavbarComponent links={employeeNavbarLinks} />
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
              <Col md='5' className='ms-5'>
                <ClientDetails clientInfo={clientInfo} />
              </Col>
              <Col md='5'>
                <InputGroup className='mb-3 pt-4'>
                  <FormControl
                    type='number'
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
            </Row>
            <Divider size={2} />
            {/*TODO:Client orders list goes here*/}
          </>
        )}
      </Container>
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
