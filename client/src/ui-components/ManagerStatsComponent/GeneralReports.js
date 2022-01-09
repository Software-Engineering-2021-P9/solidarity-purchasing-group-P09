import "bootstrap/dist/css/bootstrap.min.css";
import "./ReportsCSS.css";
import React from "react";
import { Col, Row } from "react-bootstrap";
import { gridIcon } from "../icons";
import { Pie, PieChart, Cell } from "recharts";

function GeneralReports(props) {
  const unretrieved_perc = (
    props.generalReports.unretrievedCount / props.generalReports.totalCount
  ).toFixed(2);

  const total_perc = (1 - unretrieved_perc).toFixed(2);

  const data = [
    {
      name: "Unretrieved orders",
      value: unretrieved_perc * 100,
    },
    {
      name: "Total orders",
      value: total_perc * 100,
    },
  ];

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    index,
  }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="black"
        className="pie-text"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
      >
        {`${(percent * 100).toFixed(1)}%`}
      </text>
    );
  };

  return (
    <>
      <Row className="my-3">
        <div className="title-reports">Overall SPG Reports</div>
      </Row>
      <Row className="my-3 mx-1 d-flex align-items-center">
        <Col className=" w-auto" md="auto">
          <Row>
            <Col className="icon-centre w-auto" md="auto" sm="auto">
              {gridIcon}
            </Col>
            <Col>
              <Row className="total-orders">
                {props.generalReports.unretrievedCount}
              </Row>
              <Row className="comment-stats">unretrieved orders</Row>
            </Col>
          </Row>
        </Col>
        <Col className="px-0 mx-md-5 my-sm-4 my-xs-5 my-md-0" sm="12" md="6">
          <Row className="d-flex align-items-center">
            <Col className="w-auto add-space" md="auto" sm="auto">
              <PieChart width={200} height={170}>
                <Pie
                  label={renderCustomizedLabel}
                  labelLine={false}
                  data={data}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                >
                  {data.map((entry, index) => {
                    if (entry.name === "Unretrieved orders") {
                      return <Cell key={`cell-${index}`} fill="#DB9471" />;
                    } else {
                      return <Cell key={`cell-${index}`} fill="#91885267" />;
                    }
                  })}
                </Pie>
              </PieChart>
            </Col>
            <Col>
              <Row className="total-orders">
                {(
                  (props.generalReports.unretrievedCount /
                    props.generalReports.totalCount) *
                  100
                ).toFixed(2)}{" "}
                %
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
