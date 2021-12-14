import { Row, Col } from "react-bootstrap";

function OrderRecapRow(props) {
  return (
    <Row className="d-flex justify-content-between px-2 py-1">
      <Col>
        {props.quantity}
        {"x "} {props.product.name}
      </Col>
      <Col className="align-end">
        {(props.product.availability.price * props.quantity).toFixed(2)}
        {" €"}
      </Col>
    </Row>
  );
}

export { OrderRecapRow };
