import { Button as BsButton, Col, Container, Row } from "react-bootstrap";

import "./Button.css";

function Button(props) {
  return (
    <BsButton
      className={props.className}
      variant={props.variant}
      onClick={props.onClick}
      disabled={props.disabled}
      type={props.type}>
      <Container>
        <Row className='align-items-center'>
          <Col className='p-0 d-flex justify-content-center align-items-center'>
            {props.children}
          </Col>
        </Row>
      </Container>
    </BsButton>
  );
}

export default Button;
