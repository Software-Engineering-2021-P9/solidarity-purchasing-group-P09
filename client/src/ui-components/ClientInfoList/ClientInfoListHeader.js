import { Col, Container, Row } from "react-bootstrap";

import "./ClientInfoListHeader.css";

function ClientInfoListHeader(props) {
  return (
    <Container className='client-info-list-header pb-3'>
      <Row>
        <Col>
          <b>Name</b>
        </Col>
        <Col>
          <b>Address</b>
        </Col>
        <Col>
          <b>Phone Number</b>
        </Col>
        <Col className='client-info-list-item-arrow' />
      </Row>
    </Container>
  );
}

export default ClientInfoListHeader;
