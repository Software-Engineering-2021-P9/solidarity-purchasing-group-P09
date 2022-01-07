import "bootstrap/dist/css/bootstrap.min.css";
import "./ReportsCSS.css";
import React from "react";
import {
  Col,
  Row,
  FormControl,
  Button,
  InputGroup,
  Form,
} from "react-bootstrap";

function MonthlyReports(props) {
  return (
    <>
      <Row className="my-5">
        <div className="title-reports">Monthly Reports</div>
      </Row>
      <Row className="mx-1">
        <Col className="container-this-week px-4 py-3" sm="auto" md="auto">
          <Row>
            <Col className="total-orders">15%</Col>
            <Col></Col>
          </Row>
          <Row>of unretrieved orders this month</Row>
        </Col>
        <Col className="mx-4" sm="auto" md="auto">
          <MonthlyForm
            month={props.month}
            year={props.year}
            setMonth={props.setMonth}
            setYear={props.setYear}
          />
        </Col>
      </Row>
      <Row className="stats-subtitle my-5 mx-1">
        Number of unretrieved orders per month
      </Row>
    </>
  );
}

function MonthlyForm(props) {
  const monthsDropdown = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return (
    <>
      <Row>
        <InputGroup className="my-3">
          <Form.Select
            className="form-size"
            value={props.month}
            onChange={(e) => {
              props.setMonth(e.target.value);
            }}
          >
            {monthsDropdown.map((i, index) => {
              return (
                <option value={index} key={index}>
                  {i}
                </option>
              );
            })}
          </Form.Select>
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
        Unretrieved orders in {monthsDropdown[props.month]} of {props.year} were
        560, 7% of total orders
      </Row>
    </>
  );
}

export default MonthlyReports;
