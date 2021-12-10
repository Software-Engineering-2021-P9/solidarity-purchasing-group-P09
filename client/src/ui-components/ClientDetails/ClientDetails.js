import { Col, Row } from "react-bootstrap";
import { personCircle, pinMap } from "../icon";
import "./ClientDetailsCSS.css";

function ClientDetails(props) {
  return (
    <Row>
      <Col className="info-container">
        <Row className="d-flex justify-content-center">{personCircle}</Row>
        <Row className="d-flex justify-content-center">
          {props.clientInfo?.fullName}
        </Row>
        <Row className="d-flex justify-content-center">
          {props.clientInfo?.email}
        </Row>
        <Row className="d-flex justify-content-center">
          {props.clientInfo?.phoneNumber}
        </Row>
      </Col>
      <Col>
        <Row className="info-container">
          <Col>
            <Row>
              <h5>Residential information</h5>
            </Row>
            <Row>
              <Col md="2">{pinMap}</Col>
              <Col>
                <Row>Address</Row>
                <Row>{props.clientInfo?.address}</Row>
              </Col>
            </Row>
          </Col>
        </Row>
        <Row className="info-container">
          <Col>
            <Row>
              <h5>Wallet</h5>
            </Row>
          </Col>
        </Row>
      </Col>
      <Col className="info-container">ORDERS</Col>

      {/*
      <Row>
        <Col className='fw-light' xs='3'>
          Name:
        </Col>
        <Col>{props.clientInfo?.fullName}</Col>
      </Row>
      <Row className='pt-2'>
        <Col className='fw-light' xs='3'>
          Email:
        </Col>
        <Col>{props.clientInfo?.email}</Col>
      </Row>
      <Row className='pt-2'>
        <Col className='fw-light' xs='3'>
          Address:
        </Col>
        <Col>{props.clientInfo?.address}</Col>
      </Row>
      <Row className='pt-2'>
        <Col className='fw-light' xs='3'>
          Wallet:
        </Col>
        <Col>{props.clientInfo?.wallet.toFixed(2)}€</Col>
    </Row>*/}
    </Row>
  );
}

export default ClientDetails;
