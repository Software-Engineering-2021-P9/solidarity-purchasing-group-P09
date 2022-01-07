import "bootstrap/dist/css/bootstrap.min.css";
import "./ReportsCSS.css";
import React from "react";
import { Col, Row, FormControl, Button, InputGroup } from "react-bootstrap";
import {
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Cell,
  Tooltip,
  Bar,
} from "recharts";
import { arrowDownIcon } from "../icons";

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
            <Col className="green-text">{arrowDownIcon}- 0.80%</Col>
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
      <Row className="stats-subtitle my-5 mx-1">
        Number of unretrieved orders Vs total orders per week
      </Row>
      <Row>
        <PercentageUnretrievedWeeklyBar />
      </Row>
    </>
  );
}

function PercentageUnretrievedWeeklyBar(props) {
  const data = [
    {
      week: "45",
      percentage: 0.15,
    },
    {
      week: "46",
      percentage: 0.13,
    },
    {
      week: "47",
      percentage: 0.24,
    },
    {
      week: "48",
      percentage: 0.19,
    },
    {
      week: "49",
      percentage: 0.07,
    },
    {
      week: "50",
      percentage: 0.25,
    },
    {
      week: "51",
      percentage: 0.1,
    },
    {
      week: "52",
      percentage: 0.27,
    },
    {
      week: "1",
      percentage: 0.18,
    },
    {
      week: "2",
      percentage: 0.03,
    },
  ];
  return (
    <>
      <BarChart width={800} height={250} data={data} barSize={40}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="week" />
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

function UnretrievedWeeklyBar(props) {
  const data = [
    {
      week: "45",
      unretrieved: 2,
    },
    {
      week: "46",
      unretrieved: 7,
    },
    {
      week: "47",
      unretrieved: 5,
    },
    {
      week: "48",
      unretrieved: 12,
    },
    {
      week: "49",
      unretrieved: 1,
    },
    {
      week: "50",
      unretrieved: 5,
    },
    {
      week: "51",
      unretrieved: 10,
    },
    {
      week: "52",
      unretrieved: 7,
    },
    {
      week: "1",
      unretrieved: 5,
    },
    {
      week: "2",
      unretrieved: 2,
    },
  ];
  return (
    <>
      <BarChart width={800} height={250} data={data} barSize={40}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="week" />
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
