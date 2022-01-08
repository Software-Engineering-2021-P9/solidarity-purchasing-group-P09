import "bootstrap/dist/css/bootstrap.min.css";
import "./ReportsCSS.css";
import React from "react";
import { Col, Row } from "react-bootstrap";
import { gridIcon } from "../icons";
import { PieChart } from "react-minimal-pie-chart";

function GeneralReports(props) {
  return (
    <>
      <Row className="my-3">
        <div className="title-reports">SPG Reports</div>
      </Row>
      <Row className="my-3 mx-1 d-flex align-items-center">
        <Col md="auto" sm="auto">
          <Row>
            <Col className="icon-centre">{gridIcon}</Col>
            <Col md="auto" sm="auto">
              <Row className="total-orders">{props.generalReports[0]}</Row>
              <Row className="comment-stats">unretrieved orders</Row>
            </Col>
          </Row>
        </Col>
        <Col className="mx-5">
          <Row className="d-flex align-items-center">
            <Col md="auto" sm="auto">
              <PieChart
                className="pie-chart"
                data={[
                  {
                    title: "Unretrieved",
                    value:
                      (props.generalReports[0] / props.generalReports[1]) * 100,
                    color: "#DB9471",
                  },
                  { title: "Retrieved", value: 85, color: "#FFFFFF" },
                ]}
                startAngle={270}
              />
            </Col>
            <Col md="auto" sm="auto">
              <Row className="total-orders">
                {(props.generalReports[0] / props.generalReports[1]) * 100} %
              </Row>
              <Row className="comment-stats">of the total orders</Row>
            </Col>
          </Row>
        </Col>
      </Row>
    </>
  );
}

export default GeneralReports;
