import { Col, Container, Row } from "react-bootstrap";

function ProductAvailabilityDetails(props) {
  function buildAvailabilityIndicator() {
    let color = "#2EAE0F";
    let text = "Available";
    if (props.availability?.quantity === 0) {
      color = "#D70D0D";
      text = "Not Available";
    }

    return (
      <>
        <span
          style={{
            color: color,
          }}>
          {text}
        </span>
        <span
          style={{
            height: "10px",
            width: "10px",
            backgroundColor: color,
            borderRadius: "50%",
            display: "inline-block",
          }}
        />
      </>
    );
  }

  return (
    <>
      <Container>
        <Row className='justify-content-center'>
          <Col
            className='fw-light pt-2 ps-4'
            xs='7'
            sm='5'
            style={{ backgroundColor: "#FFFFFF" }}>
            <Row>Price (x1 package):</Row>
            <Row>Packaging:</Row>
          </Col>
          <Col
            className='pt-2 pb-2'
            xs='2'
            style={{ backgroundColor: "#FFFFFF" }}>
            <Row>{props.availability?.price}</Row>
            <Row>{props.availability?.packaging}</Row>
          </Col>
        </Row>
      </Container>
      <Container>
        <Row className='pt-3  justify-content-center'>
          <Col xs='3' className='d-flex justify-content-end align-items-center'>
            {buildAvailabilityIndicator()}
          </Col>
          <Col xs='5' className='fw-light'>
            Store Availability: {props.availability?.quantity}
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default ProductAvailabilityDetails;
