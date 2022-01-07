import "bootstrap/dist/css/bootstrap.min.css";
import "./ReportsCSS.css";
import React from "react";
import { Col, Row, FormControl, Button, InputGroup } from "react-bootstrap";

function WeeklyReports(props) {
  return (
    <>
      <Row className="my-5">
        <div className="title-reports">Weekly Reports</div>
      </Row>
      <Row className="mx-1">
        <Col className="container-this-week px-4 py-3" sm="auto" md="auto">
          <Row>
            <Col className="total-orders">15%</Col>
            <Col></Col>
          </Row>
          <Row>of unretrieved orders this week</Row>
        </Col>
        <Col className="mx-4" sm="auto" md="auto">
          <WeeklyForm
            week={props.week}
            year={props.year}
            setWeek={props.setWeek}
            setYear={props.setYear}
          />
        </Col>
      </Row>
      <Row className="stats-subtitle my-5 mx-1">
        Number of unretrieved orders per week
      </Row>
      <Row>
        <UnretrievedWeeklyBar />
      </Row>
    </>
  );
}

function UnretrievedWeeklyBar(props) {
  return <></>;
}

function WeeklyForm(props) {
  return (
    <>
      <Row>
        <InputGroup className="my-3">
          <FormControl
            className="ml-3 form-size"
            type="number"
            size="sm"
            step={1}
            max={52}
            min={1}
            value={props.week}
            onChange={(e) => {
              props.setWeek(e.target.value);
            }}
          />
          <FormControl
            className="mx-3 form-size"
            type="number"
            size="sm"
            step={1}
            max={2022}
            min={2010}
            value={props.year}
            onChange={(e) => {
              props.setYear(e.target.value);
            }}
          />
          <Button>Search</Button>
        </InputGroup>
      </Row>
      <Row className="comments-week-stats">
        Unretrieved orders in week {props.week} of {props.year} were 560, 7% of
        total orders
      </Row>
    </>
  );
}

export default WeeklyReports;
