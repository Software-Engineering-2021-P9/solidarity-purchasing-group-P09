import { Col, Container, Row } from "react-bootstrap";
import { FaArrowRight } from "react-icons/fa";
import "./ClientInfoListItem.css";

function ClientInfoListItem(props) {
  return (
    <Container className="client-info-list-item px-4" onClick={props.onClick}>
      <Row className="py-2">
        <Col className="info px-4">
          <Row className="client-name mb-2">{props.clientInfo.fullName}</Row>
          <Row>{props.clientInfo.email}</Row>
          <Row>{props.clientInfo.phoneNumber}</Row>
          <Row>{props.clientInfo.address}</Row>
        </Col>
        <Col
          className="client-info-list-item-arrow d-flex align-items-center"
          sm="1"
        >
          <FaArrowRight />
        </Col>
      </Row>
    </Container>
  );
}

export default ClientInfoListItem;
