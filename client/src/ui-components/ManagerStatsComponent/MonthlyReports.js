import "bootstrap/dist/css/bootstrap.min.css";
import "./ReportsCSS.css";
import React from "react";
import { Col, Row, FormControl, InputGroup, Form } from "react-bootstrap";
import {
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Cell,
  Tooltip,
  Bar,
} from "recharts";
import { arrowUpIcon } from "../icons";

function MonthlyReports(props) {
  return (
    <>
      <Row className="my-5">
        <div className="title-reports">Monthly Reports</div>
      </Row>
      <Row className="mx-1">
        <Col
          className="container-this-week px-4 py-3 w-auto"
          sm="auto"
          md="auto"
        >
          <Row>
            <Col className="total-orders">
              {(
                (props.thisMonthReports[0] / props.thisMonthReports[1]) *
                100
              ).toFixed(2)}
            </Col>
            <Col className="red-text">{arrowUpIcon}+ 1.27%</Col>
          </Row>
          <Row>of unretrieved orders this month</Row>
        </Col>
        <Col
          className="mx-xs-0 mx-md-4 mx-lg-4 px-sm-0 px-xs-0 px-md-0 px-lg-4 media-margin"
          sm="12"
          md="auto"
        >
          <MonthlyForm
            month={props.month}
            year={props.year}
            setMonth={props.setMonth}
            setYear={props.setYear}
            formReports={props.formReports}
          />
        </Col>
      </Row>
      <Row className="stats-subtitle my-5 mx-1">
        Number of unretrieved orders per month
      </Row>
      <Row>
        <UnretrievedMonthlyBar barReports={props.barReports} />
      </Row>
      <Row className="stats-subtitle my-5 mx-1">
        Number of unretrieved orders Vs total orders per month
      </Row>
      <Row>
        <PercentageUnretrievedMonthlyBar barReports={props.barReports} />
      </Row>
    </>
  );
}

function PercentageUnretrievedMonthlyBar(props) {
  const data = [];
  Array.from(props.barReports.entries()).map((entry) => {
    const [key, val] = entry;
    let value = {
      month: key,
      percentage: ((val[0] / val[1]) * 100).toFixed(2),
    };
    data.push(value);
    return entry;
  });

  return (
    <>
      <BarChart width={800} height={250} data={data} barSize={40}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="percentage" fill="#B2B6BD">
          {data.map((entry, index) => {
            if (index === data.length - 1) {
              return <Cell key={`cell-${index}`} fill="#DB9471" />;
            } else {
              return <Cell key={`cell-${index}`} />;
            }
          })}
        </Bar>
      </BarChart>
    </>
  );
}

function UnretrievedMonthlyBar(props) {
  const data = [];
  Array.from(props.barReports.entries()).map((entry) => {
    const [key, val] = entry;
    let value = { week: key, unretrieved: val[0] };
    data.push(value);
    return entry;
  });

  return (
    <>
      <BarChart width={800} height={250} data={data} barSize={40}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="unretrieved" fill="#B2B6BD">
          {data.map((entry, index) => {
            if (index === data.length - 1) {
              return <Cell key={`cell-${index}`} fill="#DB9471" />;
            } else {
              return <Cell key={`cell-${index}`} />;
            }
          })}
        </Bar>
      </BarChart>
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
            step={1}
            max={2022}
            min={2010}
            value={props.year}
            onChange={(e) => {
              props.setYear(e.target.value);
            }}
          />
        </InputGroup>
      </Row>
      <Row className="comments-week-stats">
        Unretrieved orders in {monthsDropdown[props.month]} of {props.year} were{" "}
        {props.formReports[0]},{" "}
        {((props.formReports[0] / props.formReports[1]) * 100).toFixed(2)}% of
        total orders
      </Row>
    </>
  );
}

export default MonthlyReports;
