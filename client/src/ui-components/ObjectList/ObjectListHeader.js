import { Col, Container, Row } from "react-bootstrap";

import "./ObjectListHeader.css";

function ObjectListHeader(props) {
  return (
    <Container className='object-list-header pb-3'>
      <Row>
        {props.headerLabels.map((l, index) => (
          <Col key={index}>
            <b>{l}</b>
          </Col>
        ))}
        <Col className='object-list-item-arrow' />
      </Row>
    </Container>
  );
}

export default ObjectListHeader;
