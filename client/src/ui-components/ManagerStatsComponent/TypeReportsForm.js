import "bootstrap/dist/css/bootstrap.min.css";
import "./TypeReportsFormCSS.css";
import React from "react";
import { Col, Row } from "react-bootstrap";

function TypeReportsForm(props) {
  return (
    <>
      <Row className="bottom-border-form mx-0 my-0">
        {props.typeReports === 0 ? (
          <>
            <Col md="auto" sm="auto">
              <span className="type-reports type-reports-selected">Weekly</span>
            </Col>
            <Col md="auto" sm="auto" className="type-reports">
              <span onClick={() => props.setTypeReports(1)}>Montly</span>
            </Col>
          </>
        ) : (
          <>
            <Col md="auto" sm="auto">
              <span
                className="type-reports"
                onClick={() => props.setTypeReports(0)}
              >
                Weekly
              </span>
            </Col>
            <Col
              md="auto"
              sm="auto"
              className="type-reports type-reports-selected"
            >
              <span>Monthly</span>
            </Col>
          </>
        )}
      </Row>
    </>
  );
}

export default TypeReportsForm;
