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
      month: "FEB",
      percentage: Math.random().toFixed(2),
    },
    {
      month: "MAR",
      percentage: Math.random().toFixed(2),
    },
    {
      month: "APR",
      percentage: Math.random().toFixed(2),
    },
    {
      month: "MAY",
      percentage: Math.random().toFixed(2),
    },
    {
      month: "JUN",
      percentage: Math.random().toFixed(2),
    },
    {
      month: "JUL",
      percentage: Math.random().toFixed(2),
    },
    {
      month: "AUG",
      percentage: Math.random().toFixed(2),
    },
    {
      month: "SEP",
      percentage: Math.random().toFixed(2),
    },
    {
      month: "OCT",
      percentage: Math.random().toFixed(2),
    },
    {
      month: "NOV",
      percentage: Math.random().toFixed(2),
    },
    {
      month: "DEC",
      percentage: Math.random().toFixed(2),
    },
    {
      month: "JAN",
      percentage: Math.random().toFixed(2),
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
      month: "FEB",
      unretrieved: Math.floor(Math.random() * 101),
    },
    {
      month: "MAR",
      unretrieved: Math.floor(Math.random() * 101),
    },
    {
      month: "APR",
      unretrieved: Math.floor(Math.random() * 101),
    },
    {
      month: "MAY",
      unretrieved: Math.floor(Math.random() * 101),
    },
    {
      month: "JUN",
      unretrieved: Math.floor(Math.random() * 101),
    },
    {
      month: "JUL",
      unretrieved: Math.floor(Math.random() * 101),
    },
    {
      month: "AUG",
      unretrieved: Math.floor(Math.random() * 101),
    },
    {
      month: "SEP",
      unretrieved: Math.floor(Math.random() * 101),
    },
    {
      month: "OCT",
      unretrieved: Math.floor(Math.random() * 101),
    },
    {
      month: "NOV",
      unretrieved: Math.floor(Math.random() * 101),
    },
    {
      month: "DEC",
      unretrieved: Math.floor(Math.random() * 101),
    },
    {
      month: "JAN",
      unretrieved: Math.floor(Math.random() * 101),
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
