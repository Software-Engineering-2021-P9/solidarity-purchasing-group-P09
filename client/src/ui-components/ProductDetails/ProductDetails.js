import { Col, Container, Row } from "react-bootstrap";

function ProductDetails(props) {
  return (
    <>
      <Container className='text-start'>
        <Row>
          <Col className='fw-light' xs='4'>
            Category:
          </Col>
          <Col>{props.product?.category}</Col>
        </Row>
        <Row className='pt-2'>
          <Col className='fw-light' xs='4'>
            Description:
          </Col>
          <Col>{props.product?.description}</Col>
        </Row>
      </Container>
    </>
  );
}

export default ProductDetails;
