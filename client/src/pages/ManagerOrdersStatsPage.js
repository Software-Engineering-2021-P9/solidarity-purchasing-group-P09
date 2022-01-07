import React, { useState } from "react";
import { Container, Row } from "react-bootstrap";
import { NavbarComponent } from "../ui-components/NavbarComponent/NavbarComponent";

import "bootstrap/dist/css/bootstrap.min.css";
import GeneralReports from "../ui-components/ManagerStatsComponent/GeneralReports";
import TypeReportsForm from "../ui-components/ManagerStatsComponent/TypeReportsForm";
import WeeklyReports from "../ui-components/ManagerStatsComponent/WeeklyReports";
import MonthlyReports from "../ui-components/ManagerStatsComponent/MonthlyReports";

function ManagerOrdersStatsPage(props) {
  const totalOrders = 1000; // get # total orders
  const totalUnretrievedOrders = 150;

  const [week, setWeek] = useState(1);
  const [year, setYear] = useState(2022);
  const [month, setMonth] = useState(1);
  const [typeReports, setTypeReports] = useState(0); // 0 weekly, 1 monthly

  return (
    <Container>
      <Row>
        <NavbarComponent links={[]} />
      </Row>
      <Row className="my-4 mx-3">
        <GeneralReports
          totalOrders={totalOrders}
          totalUnretrievedOrders={totalUnretrievedOrders}
        />
      </Row>
      <Row className="my-4 mx-3">
        <TypeReportsForm
          typeReports={typeReports}
          setTypeReports={setTypeReports}
        />
      </Row>
      <Row className="my-4 mx-3">
        {typeReports === 0 ? (
          <>
            <WeeklyReports
              week={week}
              year={year}
              setWeek={setWeek}
              setYear={setYear}
            />
          </>
        ) : (
          <>
            <MonthlyReports
              month={month}
              year={year}
              setMonth={setMonth}
              setYear={setYear}
            />
          </>
        )}
      </Row>
    </Container>
  );
}

export { ManagerOrdersStatsPage };
