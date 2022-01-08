import React, { useState, useEffect, useReducer } from "react";
import { Container, Row, Spinner } from "react-bootstrap";
import { NavbarComponent } from "../ui-components/NavbarComponent/NavbarComponent";

import "bootstrap/dist/css/bootstrap.min.css";
import GeneralReports from "../ui-components/ManagerStatsComponent/GeneralReports";
import TypeReportsForm from "../ui-components/ManagerStatsComponent/TypeReportsForm";
import WeeklyReports from "../ui-components/ManagerStatsComponent/WeeklyReports";
import MonthlyReports from "../ui-components/ManagerStatsComponent/MonthlyReports";
import {
  getWeekIntervalOrdersStat,
  getWeeklyOrdersStat,
} from "../services/ApiClient";
import ErrorToast from "../ui-components/ErrorToast/ErrorToast";

function ManagerOrdersStatsPage(props) {
  const [requestError, setRequestError] = useState("");
  const [initialized, setInitialized] = useState(false);

  const [generalReports, setGeneralReports] = useState([]); // get # total orders and # total unretrieved
  const [thisWeekReports, setThisWeekReports] = useState([]);
  const [thisMonthReports, setThisMonthReports] = useState([]);
  const [formReports, setFormReports] = useState([]);
  const [barReports, setBarReports] = useState(new Map());
  const [week, setWeek] = useState(1);
  const [year, setYear] = useState(2022);
  const [month, setMonth] = useState(1);

  const [typeReports, setTypeReports] = useState(0); // 0 weekly, 1 monthly

  useEffect(() => {
    const getGeneralReports = () => {
      getWeeklyOrdersStat()
        .then((result) => {
          setGeneralReports(result);
          setInitialized(true);
        })
        .catch((err) =>
          setRequestError("Failed to fetch general reports: " + err.message)
        );
      // this week
      getWeeklyOrdersStat(1, 2022)
        .then((result) => {
          setThisWeekReports(result);
          setInitialized(true);
        })
        .catch((err) =>
          setRequestError("Failed to fetch this week reports: " + err.message)
        );
      // this month
      getWeekIntervalOrdersStat(1, 4, 2022, 2022)
        .then((result) => {
          setThisMonthReports(result);
          setInitialized(true);
        })
        .catch((err) =>
          setRequestError("Failed to fetch form reports: " + err.message)
        );
    };
    getGeneralReports();
  }, []);

  useEffect(() => {
    const getBarReports = async () => {
      if (typeReports == 0) {
        let map = new Map();
        let year = 2021;
        const weeks = [45, 46, 47, 48, 49, 50, 51, 52, 1, 2];

        for (const w of weeks) {
          if (w == 1 || w == 2) {
            year = 2022;
          }
          var res = await getWeeklyOrdersStat(w, year);
          map.set(w, res);
        }

        setBarReports(map);
      } else {
        let week1 = (month + 1) * 4 - 3;
        let week2 = (month + 1) * 4;
        getWeekIntervalOrdersStat(week1, week2, year, year)
          .then((result) => {
            setFormReports(result);
            setInitialized(true);
          })
          .catch((err) =>
            setRequestError("Failed to fetch form reports: " + err.message)
          );
      }
    };
    getBarReports();
  }, [typeReports]);

  useEffect(() => {
    const getFormReports = () => {
      if (typeReports == 0) {
        getWeeklyOrdersStat(week, year)
          .then((result) => {
            setFormReports(result);
            setInitialized(true);
          })
          .catch((err) =>
            setRequestError("Failed to fetch form reports: " + err.message)
          );
      } else {
        let week1 = (month + 1) * 4 - 3;
        let week2 = (month + 1) * 4;
        getWeekIntervalOrdersStat(week1, week2, year, year)
          .then((result) => {
            setFormReports(result);
            setInitialized(true);
          })
          .catch((err) =>
            setRequestError("Failed to fetch form reports: " + err.message)
          );
      }
    };
    getFormReports();
  }, [week, year, month]);

  return (
    <Container>
      <Row>
        <NavbarComponent links={[]} />
      </Row>
      {initialized ? (
        <>
          <Row className="my-4 mx-3">
            <GeneralReports generalReports={generalReports} />
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
                  formReports={formReports}
                  thisWeekReports={thisWeekReports}
                  setWeek={setWeek}
                  setYear={setYear}
                  barReports={barReports}
                />
              </>
            ) : (
              <>
                <MonthlyReports
                  month={month}
                  year={year}
                  formReports={formReports}
                  thisMonthReports={thisMonthReports}
                  setMonth={setMonth}
                  setYear={setYear}
                />
              </>
            )}
          </Row>
          <ErrorToast
            errorMessage={requestError}
            onClose={() => setRequestError("")}
          />
        </>
      ) : (
        <>
          <Row className="vh-100 justify-content-center align-content-center">
            <Spinner animation="border" />
          </Row>
        </>
      )}
    </Container>
  );
}

export { ManagerOrdersStatsPage };
