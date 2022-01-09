import "bootstrap/dist/css/bootstrap.min.css";
import "./ReportsCSS.css";
import React from "react";
import { Col, Row, FormControl, InputGroup } from "react-bootstrap";
import {
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
  Legend,
} from "recharts";
import { arrowDownIcon, arrowUpIcon } from "../icons";

function WeeklyReports(props) {
  const this_week_perc = (
    (props.thisWeekReports[0] / props.thisWeekReports[1]) *
    100
  ).toFixed(2);
  const prev_week_perc = (
    (props.previousWeekReports[0] / props.previousWeekReports[1]) *
    100
  ).toFixed(2);
  const diff = this_week_perc - prev_week_perc;

  return (
    <>
      <Row className="my-5">
        <div className="title-reports">Weekly Reports</div>
      </Row>
      <Row className="mx-1">
        <Col
          className="container-this-week px-4 py-3 w-auto"
          sm="auto"
          md="auto"
        >
          <Row>
            <Col className="total-orders">{this_week_perc} %</Col>
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
          <Row>of unretrieved orders this week</Row>
        </Col>
        <Col
          className="mx-xs-0 mx-md-4 mx-lg-4 px-sm-0 px-xs-0 px-md-0 px-lg-4 media-margin"
          sm="12"
          md="auto"
        >
          <WeeklyForm
            week={props.week}
            year={props.year}
            setWeek={props.setWeek}
            setYear={props.setYear}
            formReports={props.formReports}
          />
        </Col>
      </Row>
      <Row className="stats-subtitle my-5 mx-1">
        Number of unretrieved orders per week
      </Row>
      <Row>
        <UnretrievedWeeklyBar barReports={props.barReports} />
      </Row>
    </>
  );
}

function UnretrievedWeeklyBar(props) {
  const data = [];
  Array.from(props.barReports.entries()).map((entry) => {
    const [key, val] = entry;
    let value = { week: key, unretrieved: val[0], total: val[1] };
    data.push(value);
    return entry;
  });

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      let year_info = 2021;
      if (label === 1 || label === 2) year_info = 2022;
      return (
        <div className="custom-tooltip">
          <p className="label-tooltip">{`week : ${label}/${year_info}`}</p>
          <p className="unretrieved-info">{`unretrieved orders : ${payload[0].value}`}</p>
          <p className="total-info">{`total orders : ${payload[1].value}`}</p>
          <p>{`% of unretrieved orders : ${(
            (payload[0].value / payload[1].value) *
            100
          ).toFixed(2)}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <>
      <BarChart width={800} height={250} data={data} barSize={40}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="week" />
        <YAxis />
        <Legend verticalAlign="top" height={36} />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey="unretrieved" fill="#DB9471" />
        <Bar dataKey="total" fill="#B2B6BD" />
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
            step={1}
            max={52}
            min={1}
            value={props.week}
            onChange={(e) => {
              if (e.target.value >= 1 && e.target.value <= 52) {
                props.setWeek(parseInt(e.target.value));
              }
            }}
          />
          <FormControl
            className="mx-3 form-size"
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
      {props.formReports[0] ? (
        <Row className="comments-week-stats">
          Unretrieved orders in week {props.week} of {props.year} were{" "}
          {props.formReports[0]},{" "}
          {((props.formReports[0] / props.formReports[1]) * 100).toFixed(2)}% of
          total orders
        </Row>
      ) : (
        <Row className="comments-week-stats">
          Sorry, data you are looking for is not available
        </Row>
      )}
    </>
  );
}

export default WeeklyReports;
