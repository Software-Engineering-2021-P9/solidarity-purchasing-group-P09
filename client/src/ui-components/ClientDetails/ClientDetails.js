import { Col, FormControl, InputGroup, Row } from "react-bootstrap";
import { useEffect, useState } from "react";
import UserRoles from "../../services/models/UserRoles";
import Button from "../Button/Button";
import { Link } from "react-router-dom";
import { personCircleIcon, pinMapIcon, walletIcon } from "../icon";
import { getOrders } from "../../services/ApiClient";
import "./ClientDetailsCSS.css";

function ClientDetails(props) {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    getOrders(props.clientInfo?.id).then((newO) => {
      setOrders(newO);
    });
  }, [props.clientInfo?.id]);

  return (
    <Row>
      <Col
        className="info-container main-details"
        lg={{ span: 4, order: 1 }}
        md={{ span: 6, order: 1 }}
        sm={{ span: 12, order: 1 }}
        xs={{ span: 12, order: 1 }}
      >
        <Row className="d-flex justify-content-center py-3">
          {personCircleIcon}
        </Row>
        <Row className="d-flex justify-content-center fullname">
          {props.clientInfo?.fullName}
        </Row>
        <Row className="d-flex justify-content-center email">
          {props.clientInfo?.email}
        </Row>
        <Row className="d-flex justify-content-center number">
          {props.clientInfo?.phoneNumber}
        </Row>
      </Col>
      <Col
        className="px-0"
        lg={{ span: 4, order: 2 }}
        md={{ span: 12, order: 3 }}
        sm={{ span: 12, order: 2 }}
        xs={{ span: 12, order: 2 }}
      >
        <Row className="info-container ">
          <Col>
            <Row>
              <h5>Residential information</h5>
            </Row>
            <Row>
              <Col
                md="auto"
                className="w-auto circle d-flex justify-content-center"
              >
                {pinMapIcon}
              </Col>
              <Col className="mx-3">
                <Row>
                  <span className="subtitle">Address</span>
                </Row>
                <Row>{props.clientInfo?.address}</Row>
              </Col>
            </Row>
          </Col>
        </Row>
        <Row className="info-container divider">
          <Col>
            <Row>
              <h5>Wallet</h5>
            </Row>
            <Row>
              <Col
                md="auto"
                className="w-auto circle d-flex justify-content-center"
              >
                {walletIcon}
              </Col>
              <Col className="mx-3">
                <Row>
                  <span className="subtitle">
                    {" "}
                    Actual: {props.clientInfo?.wallet.toFixed(2)} €
                  </span>
                </Row>
                <Row>
                  {props.loggedUser.role === UserRoles.EMPLOYEE && (
                    <InputGroup className="px-0">
                      <FormControl
                        placeholder="50€"
                        value={props.fundsToAddAmount}
                        onChange={props.onFundsToAddAmountChange}
                        required
                      />
                      <Button onClick={props.onAddFundsToWalletButtonClick}>
                        Add funds
                      </Button>
                    </InputGroup>
                  )}
                </Row>
              </Col>
            </Row>
          </Col>
        </Row>
      </Col>
      <Col
        className="info-container"
        lg={{ order: 3 }}
        md={{ order: 2 }}
        sm={{ order: 3 }}
        xs={{ order: 3 }}
      >
        <Row>
          <h5>Orders</h5>
        </Row>
        <Row className="mx-0">
          <span className="num-order">
            <span className="black">{orders.length}</span> (Total)
          </span>
        </Row>
        {props.loggedUser.role === UserRoles.EMPLOYEE && (
          <Row className="mx-0 line-divider">
            <></>
          </Row>
        )}
        <Row className="mx-0 ">
          {props.loggedUser.role === UserRoles.EMPLOYEE && (
            <Row className="mx-0 px-0 my-3 d-flex justify-content-center">
              <Link
                className="w-auto"
                to={{
                  pathname: "/",
                  state: {
                    clientID: props.clientInfo?.id,
                    creatingOrderMode: true,
                    shoppingCart: new Map(),
                  },
                }}
              >
                <Button>CREATE NEW ORDER</Button>
              </Link>
            </Row>
          )}
        </Row>
      </Col>
    </Row>
  );
}

export default ClientDetails;
