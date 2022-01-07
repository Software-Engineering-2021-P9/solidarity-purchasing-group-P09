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
      week: "43",
      percentage: Math.random().toFixed(2),
    },
    {
      week: "44",
      percentage: Math.random().toFixed(2),
    },
    {
      week: "45",
      percentage: Math.random().toFixed(2),
    },
    {
      week: "46",
      percentage: Math.random().toFixed(2),
    },
    {
      week: "47",
      percentage: Math.random().toFixed(2),
    },
    {
      week: "48",
      percentage: Math.random().toFixed(2),
    },
    {
      week: "49",
      percentage: Math.random().toFixed(2),
    },
    {
      week: "50",
      percentage: Math.random().toFixed(2),
    },
    {
      week: "51",
      percentage: Math.random().toFixed(2),
    },
    {
      week: "52",
      percentage: Math.random().toFixed(2),
    },
    {
      week: "1",
      percentage: Math.random().toFixed(2),
    },
    {
      week: "2",
      percentage: Math.random().toFixed(2),
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
      week: "43",
      unretrieved: Math.floor(Math.random() * 21),
    },
    {
      week: "44",
      unretrieved: Math.floor(Math.random() * 21),
    },
    {
      week: "45",
      unretrieved: Math.floor(Math.random() * 21),
    },
    {
      week: "46",
      unretrieved: Math.floor(Math.random() * 21),
    },
    {
      week: "47",
      unretrieved: Math.floor(Math.random() * 21),
    },
    {
      week: "48",
      unretrieved: Math.floor(Math.random() * 21),
    },
    {
      week: "49",
      unretrieved: Math.floor(Math.random() * 21),
    },
    {
      week: "50",
      unretrieved: Math.floor(Math.random() * 21),
    },
    {
      week: "51",
      unretrieved: Math.floor(Math.random() * 21),
    },
    {
      week: "52",
      unretrieved: Math.floor(Math.random() * 21),
    },
    {
      week: "1",
      unretrieved: Math.floor(Math.random() * 21),
    },
    {
      week: "2",
      unretrieved: Math.floor(Math.random() * 21),
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
