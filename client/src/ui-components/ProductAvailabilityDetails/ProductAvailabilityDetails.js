import { Col, Container, Row, ProgressBar } from "react-bootstrap";
import { ProductAvailabilityStatus } from "../../services/models/ProductAvailability";
import Divider from "../Divider/Divider";

function ProductAvailabilityDetails(props) {
  function buildAvailabilityIndicator() {
    let color = "#2EAE0F";
    let text = "Available";
    if (props.availability?.status === ProductAvailabilityStatus.WAITING) {
      color = "#FFDA00";
      text = "Not confirmed";
    } else if (props.availability?.leftQuantity === 0) {
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
        </span>{" "}
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

  function buildAvailabilityWidget() {
    return (
      <Container>
        <Container className='text-center pb-2'>
          {buildAvailabilityIndicator()}
        </Container>
        <ProgressBar
          now={props.availability?.leftQuantity}
          max={props.availability?.quantity}
          min={0}
          variant='progressbar'
          className='px-0 mx-2'
        />
        <Container className='text-center'>
          <b>{props.availability?.leftQuantity} left</b> of{" "}
          {props.availability?.quantity} available
        </Container>
      </Container>
    );
  }

  return (
    <>
      <Container>
        <Row className='justify-content-center'>
          <Col
            className='fw-light ps-4'
            xs='7'
            sm='6'
            md='6'
            lg='4'
            style={{ backgroundColor: "#FFFFFF" }}>
            <Row>Price (x1 package):</Row>
            <Row>Packaging:</Row>
          </Col>
          <Col className='pb-3' xs='2' style={{ backgroundColor: "#FFFFFF" }}>
            <Row>{props.availability?.price}€</Row>
            <Row>{props.availability?.packaging}</Row>
          </Col>
        </Row>
      </Container>
      <Divider />
      <Container>
        <Row className='justify-content-center'>
          {buildAvailabilityWidget()}
        </Row>
      </Container>
    </>
  );
}

export default ProductAvailabilityDetails;
