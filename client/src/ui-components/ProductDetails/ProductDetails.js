import { Col, Row } from "react-bootstrap";

function ProductDetails(props) {
  return (
    <>
      <Row className='pt-2'>
        <Col className='fw-light' xs='3'>
          Category:
        </Col>
        <Col>{props.product?.category}</Col>
      </Row>
      <Row className='pt-2'>
        <Col className='fw-light' xs='3'>
          Description:
        </Col>
        <Col>{props.product?.description}</Col>
      </Row>
    </>
  );
}

export default ProductDetails;
