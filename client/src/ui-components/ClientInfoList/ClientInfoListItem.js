import { Col, Container, Row } from "react-bootstrap";
import { FaArrowRight } from "react-icons/fa";
import { emailIcon, personIcon, phoneIcon, pinMapSmallIcon } from "../icons";
import "./ClientInfoListItem.css";

function ClientInfoListItem(props) {
  return (
    <Container className="client-info-list-item px-4" onClick={props.onClick}>
      <Row className="py-2">
        <Col className="info px-4">
          <Row className="client-name mb-2">
            <Col
              className="px-0"
              xl="auto"
              lg="auto"
              md="auto"
              sm="auto"
              xs="auto"
            >
              {personIcon}
            </Col>
            <Col>{props.clientInfo.fullName}</Col>
          </Row>
          <Row>
            <Col
              className="px-0"
              xl="auto"
              lg="auto"
              md="auto"
              sm="auto"
              xs="auto"
            >
              {emailIcon}
            </Col>
            <Col>{props.clientInfo.email}</Col>
          </Row>
          <Row>
            <Col
              className="px-0"
              xl="auto"
              lg="auto"
              md="auto"
              sm="auto"
              xs="auto"
            >
              {phoneIcon}
            </Col>
            <Col>{props.clientInfo.phoneNumber}</Col>
          </Row>
          <Row>
            <Col
              className="px-0"
              xl="auto"
              lg="auto"
              md="auto"
              sm="auto"
              xs="auto"
            >
              {pinMapSmallIcon}
            </Col>
            <Col>{props.clientInfo.address}</Col>
          </Row>
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
