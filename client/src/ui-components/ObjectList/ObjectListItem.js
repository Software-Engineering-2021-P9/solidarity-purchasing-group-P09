import { Col, Container, Row } from "react-bootstrap";
import { FaArrowRight } from "react-icons/fa";
import "./ObjectListItem.css";

function ObjectListItem(props) {
  return (
    <Container className='object-list-item py-3' onClick={props.onItemClick}>
      <Row className='align-items-center'>
        {props.item.map((renderer) => (
          <Col>{renderer}</Col>
        ))}
        <Col className='object-list-item-arrow'>
          <FaArrowRight />
        </Col>
      </Row>
    </Container>
  );
}

export default ObjectListItem;
