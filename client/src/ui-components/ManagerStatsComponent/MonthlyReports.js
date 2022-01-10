import "bootstrap/dist/css/bootstrap.min.css";
import "./ReportsCSS.css";
import React from "react";
import {
  Col,
  Row,
  FormControl,
  InputGroup,
  Form,
  Spinner,
} from "react-bootstrap";
import {
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
  Legend,
  Label,
} from "recharts";
import { arrowDownIcon, arrowUpIcon } from "../icons";

function MonthlyReports(props) {
  const this_month_perc = (
    (props.thisMonthReports.unretrievedCount /
      props.thisMonthReports.totalCount) *
    100
  ).toFixed(2);
  const prev_month_perc = (
    (props.previousMonthReports.unretrievedCount /
      props.previousMonthReports.totalCount) *
    100
  ).toFixed(2);
  const diff = (this_month_perc - prev_month_perc).toFixed(2);

  return (
    <>
      <Row className="my-4 mb-5">
        <div className="title-reports">Monthly Reports</div>
      </Row>
      <Row className="mx-1">
        <Col
          className="container-this-week px-4 py-3 w-auto"
          sm="auto"
          md="auto"
        >
          <Row>
            <Col className="total-orders">{this_month_perc} %</Col>
            {diff > 0 ? (
              <Col className="red-text">
                {arrowUpIcon}+ {diff}%
              </Col>
            ) : (
              <Col className="green-text">
                {arrowDownIcon}
                {diff}%
              </Col>
            )}
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
        Number of unretrieved orders Vs Number of total orders per month
      </Row>
      {props.initializedBar ? (
        <Row>
          <UnretrievedMonthlyBar barReports={props.barReports} />
        </Row>
      ) : (
        <Row className="h-auto justify-content-center align-content-center">
          <Spinner animation="border" />
        </Row>
      )}
    </>
  );
}

function UnretrievedMonthlyBar(props) {
  const data = [];
  Array.from(props.barReports.entries()).map((entry) => {
    const [key, val] = entry;
    let value = {
      month: key,
      unretrieved: val.unretrievedCount,
      total: val.totalCount,
    };
    data.push(value);
    return entry;
  });
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      let year_info = 2021;
      if (label === "JAN") year_info = 2022;
      return (
        <div className="custom-tooltip">
          <h6>{`month : ${label}-${year_info}`}</h6>
          <p>{`unretrieved orders : ${payload[0].value}`}</p>
          <p>{`total orders : ${payload[1].value}`}</p>
          {payload[0].value && payload[1].value ? (
            <p>{`% of unretrieved orders : ${(
              (payload[0].value / payload[1].value) *
              100
            ).toFixed(2)}`}</p>
          ) : (
            <p>{`% of unretrieved orders : N/A`}</p>
          )}
        </div>
      );
    }

    return null;
  };

  return (
    <>
      <BarChart width={800} height={250} data={data} barSize={40}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month">
          <Label value="month" position="bottom" offset={-10} />
        </XAxis>
        <YAxis
          label={{
            value: "# orders",
            angle: -90,
            position: "left",
            offset: -10,
          }}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend verticalAlign="top" height={36} />
        <Bar dataKey="unretrieved" fill="#DB9471" />
        <Bar dataKey="total" fill="#B2B6BD" />
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
            className="mx-3 form-size"
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
            className="ml-3 form-size"
            type="number"
            step={1}
            max={2022}
            min={2010}
            value={props.year}
            onChange={(e) => {
              if (e.target.value >= 2010 && e.target.value <= 2022) {
                props.setYear(parseInt(e.target.value));
              }
            }}
          />
        </InputGroup>
      </Row>
      {props.formReports.unretrievedCount ? (
        <Row className="comments-week-stats">
          Unretrieved orders in {monthsDropdown[props.month]} of {props.year}{" "}
          were {props.formReports.unretrievedCount},{" "}
          {(
            (props.formReports.unretrievedCount /
              props.formReports.totalCount) *
            100
          ).toFixed(2)}
          % of total orders
        </Row>
      ) : (
        <Row className="comments-week-stats">
          Sorry, data you are looking for is not available
        </Row>
      )}
    </>
  );
}

export default MonthlyReports;
