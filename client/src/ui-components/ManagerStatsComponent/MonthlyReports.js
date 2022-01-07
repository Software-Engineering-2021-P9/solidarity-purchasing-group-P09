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
        <Col className="container-this-week px-4 py-3" sm="auto" md="auto">
          <Row>
            <Col className="total-orders">15%</Col>
            <Col className="red-text">{arrowUpIcon}+ 1.27%</Col>
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
      <Row>
        <UnretrievedMonthlyBar />
      </Row>
      <Row className="stats-subtitle my-5 mx-1">
        Number of unretrieved orders Vs total orders per month
      </Row>
      <Row>
        <PercentageUnretrievedMonthlyBar />
      </Row>
    </>
  );
}

function PercentageUnretrievedMonthlyBar(props) {
  const data = [
    {
      month: "APR",
      percentage: 0.18,
    },
    {
      month: "MAY",
      percentage: 0.23,
    },
    {
      month: "JUN",
      percentage: 0.21,
    },
    {
      month: "JUL",
      percentage: 0.03,
    },
    {
      month: "AUG",
      percentage: 0.04,
    },
    {
      month: "SEP",
      percentage: 0.18,
    },
    {
      month: "OCT",
      percentage: 0.19,
    },
    {
      month: "NOV",
      percentage: 0.13,
    },
    {
      month: "DEC",
      percentage: 0.27,
    },
    {
      month: "JAN",
      percentage: 0.01,
    },
  ];
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
  const data = [
    {
      month: "APR",
      unretrieved: 58,
    },
    {
      month: "MAY",
      unretrieved: 37,
    },
    {
      month: "JUN",
      unretrieved: 42,
    },
    {
      month: "JUL",
      unretrieved: 16,
    },
    {
      month: "AUG",
      unretrieved: 20,
    },
    {
      month: "SEP",
      unretrieved: 19,
    },
    {
      month: "OCT",
      unretrieved: 33,
    },
    {
      month: "NOV",
      unretrieved: 17,
    },
    {
      month: "DEC",
      unretrieved: 14,
    },
    {
      month: "JAN",
      unretrieved: 3,
    },
  ];
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
