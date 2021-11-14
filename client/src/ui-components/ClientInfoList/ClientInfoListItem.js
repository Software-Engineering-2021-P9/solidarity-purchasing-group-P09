import { Col, Container, Row } from "react-bootstrap";
import { FaArrowRight } from "react-icons/fa";
import "./ClientInfoListItem.css";

function ClientInfoListItem(props) {
  return (
    <Container className='client-info-list-item py-3' onClick={props.onClick}>
      <Row className='align-items-center'>
        <Col>{props.clientInfo.fullName}</Col>
        <Col>{props.clientInfo.address}</Col>
        <Col>{props.clientInfo.phoneNumber}</Col>
        <Col className='client-info-list-item-arrow'>
          <FaArrowRight />
        </Col>
      </Row>
    </Container>
  );
}

export default ClientInfoListItem;
