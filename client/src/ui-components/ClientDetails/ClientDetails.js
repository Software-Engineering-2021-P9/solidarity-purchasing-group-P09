import { Col, Row } from "react-bootstrap";

function ClientDetails(props) {
  return (
    <>
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
      </Row>
    </>
  );
}

export default ClientDetails;
