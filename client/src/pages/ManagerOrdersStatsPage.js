import React, { useState, useEffect, useContext, useCallback } from "react";
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
import { getAvailableNavbarLinks } from "../Routes";
import { AuthContext } from "../contexts/AuthContextProvider";

function ManagerOrdersStatsPage(props) {
  const authContext = useContext(AuthContext);

  const [requestError, setRequestError] = useState("");
  const [initialized, setInitialized] = useState(false);
  const [initializedBar, setInitializedBar] = useState(false);

  const [generalReports, setGeneralReports] = useState({}); // get # total orders and # total unretrieved
  const [thisWeekReports, setThisWeekReports] = useState({});
  const [thisMonthReports, setThisMonthReports] = useState({});
  const [previousWeekReports, setPreviousWeekReports] = useState({});
  const [previousMonthReports, setPreviousMonthReports] = useState({});
  const [formReports, setFormReports] = useState({});
  const [barReports, setBarReports] = useState(new Map());

  const [currWeek, setCurrWeek] = useState(0);
  const [week, setWeek] = useState(2);
  const [year, setYear] = useState(2022);
  const [month, setMonth] = useState(0);
  const [typeReports, setTypeReports] = useState(0); // 0 weekly, 1 monthly

  const getWeekNumbers = useCallback(
    (month_number) => {
      var start_date = new Date(year, month_number, 1);
      var num_days = new Date(year, month_number + 1, 0).getDate();
      var end_date = new Date(
        start_date.getFullYear(),
        start_date.getMonth(),
        start_date.getDate() + num_days - 1
      );
      var oneJan = new Date(start_date.getFullYear(), 0, 1);
      var numberOfDays_start = Math.floor(
        (start_date - oneJan) / (24 * 60 * 60 * 1000)
      );
      var numberOfDays_end = Math.floor(
        (end_date - oneJan) / (24 * 60 * 60 * 1000)
      );
      const week_start = Math.ceil(
        (start_date.getDay() + 1 + numberOfDays_start) / 7
      );
      let week_end = Math.ceil((end_date.getDay() + 1 + numberOfDays_end) / 7);

      const currentMonth = new Date().getMonth();
      if (currentMonth == month_number) {
        week_end = currWeek;
      }

      return [week_start, week_end];
    },
    [year, currWeek]
  );

  useEffect(() => {
    const getGeneralReports = () => {
      // general
      getWeeklyOrdersStat()
        .then((result) => {
          setGeneralReports(result);
          setInitialized(true);
        })
        .catch((err) =>
          setRequestError("Failed to fetch general reports: " + err.message)
        );

      // this week
      getWeeklyOrdersStat(currentValues.curr_week, currentValues.curr_year)
        .then((result) => {
          setThisWeekReports(result);
        })
        .catch((err) =>
          setRequestError("Failed to fetch this week reports: " + err.message)
        );

      // this month
      let this_month_week = getWeekNumbers(currentValues.curr_month);
      getWeekIntervalOrdersStat(
        this_month_week[0],
        currentValues.curr_week,
        currentValues.curr_year,
        currentValues.curr_year
      )
        .then((result) => {
          setThisMonthReports(result);
        })
        .catch((err) =>
          setRequestError("Failed to fetch this month reports: " + err.message)
        );

      // previous week
      let prev_year =
        currentValues.curr_month === 0 && currentValues.curr_week === 1
          ? 2021
          : 2022;
      getWeeklyOrdersStat(currentValues.prev_week, prev_year)
        .then((result) => {
          setPreviousWeekReports(result);
        })
        .catch((err) =>
          setRequestError(
            "Failed to fetch previous week reports: " + err.message
          )
        );
      // previous month
      prev_year = currentValues.curr_month === 0 ? 2021 : 2022;
      let prev_month_week = getWeekNumbers(currentValues.prev_month);
      getWeekIntervalOrdersStat(
        prev_month_week[0],
        prev_month_week[1],
        prev_year,
        prev_year
      )
        .then((result) => {
          setPreviousMonthReports(result);
        })
        .catch((err) =>
          setRequestError(
            "Failed to fetch previous month reports: " + err.message
          )
        );
    };
    let currentValues;
    var currentdate = new Date();
    var oneJan = new Date(currentdate.getFullYear(), 0, 1);
    var numberOfDays = Math.floor(
      (currentdate - oneJan) / (24 * 60 * 60 * 1000)
    );
    const curr_week = Math.ceil((currentdate.getDay() + 1 + numberOfDays) / 7);
    const curr_year = currentdate.getFullYear();
    const curr_month = currentdate.getMonth();
    const prev_week = curr_week === 1 ? 52 : curr_week - 1;
    const prev_month = curr_month === 0 ? 11 : curr_month - 1;
    setCurrWeek(curr_week);
    currentValues = {
      curr_week: curr_week,
      curr_year: curr_year,
      curr_month: curr_month,
      prev_week: prev_week,
      prev_month: prev_month,
    };

    getGeneralReports();
  }, [getWeekNumbers]);

  useEffect(() => {
    const getBarReports = async () => {
      if (typeReports === 0) {
        let map_week_bar = new Map();
        let year_week_bar = 2021;
        const weeks_week_bar = [46, 47, 48, 49, 50, 51, 52, 1, 2];

        for (const w of weeks_week_bar) {
          if (w === 1 || w === 2) {
            year_week_bar = 2022;
          }
          var res_week_bar = await getWeeklyOrdersStat(w, year_week_bar);
          map_week_bar.set(w, res_week_bar);
        }
        setBarReports(map_week_bar);
        setInitializedBar(true);
      } else {
        let map_month_bar = new Map();
        let year_month_bar = 2021;
        let months_month_bar = [
          "APR",
          "MAY",
          "JUN",
          "JUL",
          "AUG",
          "SEP",
          "OCT",
          "NOV",
          "DEC",
          "JAN",
        ];
        const months_i_month_bar = [3, 4, 5, 6, 7, 8, 9, 10, 11, 0];

        let cont = 0;
        for (const m of months_i_month_bar) {
          if (m === 0) {
            year_month_bar = 2022;
          }
          const weeks = getWeekNumbers(m);
          var res2 = await getWeekIntervalOrdersStat(
            weeks[0],
            weeks[1],
            year_month_bar,
            year_month_bar
          );
          map_month_bar.set(months_month_bar[cont], res2);
          cont++;
        }
        setBarReports(map_month_bar);
        setInitializedBar(true);
      }
    };
    setInitializedBar(false);
    getBarReports();
  }, [typeReports]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const getFormReports = () => {
      if (typeReports === 0) {
        getWeeklyOrdersStat(week, year)
          .then((result) => {
            setFormReports(result);
            setInitialized(true);
          })
          .catch((err) =>
            setRequestError("Failed to fetch form reports: " + err.message)
          );
      } else {
        const weeks = getWeekNumbers(month);
        getWeekIntervalOrdersStat(weeks[0], weeks[1], year, year)
          .then((result) => {
            setFormReports(result);
            setInitialized(true);
          })
          .catch((err) =>
            setRequestError("Failed to fetch form reports: " + err.message)
          );
      }
    };
    if (typeReports === 1 && year === 2022 && month > 0) {
      setFormReports({});
    } else if (typeReports === 0 && year === 2022 && week > 2) {
      setFormReports({});
    } else {
      getFormReports();
    }
  }, [week, year, month, typeReports, getWeekNumbers]);

  return (
    <Container>
      <Row>
        <NavbarComponent
          links={getAvailableNavbarLinks(authContext.currentUser)}
          loggedUser={authContext.currentUser}
          userIconLink={authContext.getUserIconLink()}
        />
      </Row>
      {initialized ? (
        <>
          <Row className="my-4 mx-3">
            <GeneralReports generalReports={generalReports} />
          </Row>
          <Row className="my-4 mx-3 w-100">
            <TypeReportsForm
              typeReports={typeReports}
              setTypeReports={setTypeReports}
            />
          </Row>
          <Row className="my-3 mx-3">
            {typeReports === 0 && (
              <>
                <WeeklyReports
                  week={week}
                  year={year}
                  formReports={formReports}
                  thisWeekReports={thisWeekReports}
                  previousWeekReports={previousWeekReports}
                  setWeek={setWeek}
                  setYear={setYear}
                  currWeek={currWeek}
                  barReports={barReports}
                  initializedBar={initializedBar}
                />
              </>
            )}
            {typeReports === 1 && (
              <>
                <MonthlyReports
                  month={month}
                  year={year}
                  formReports={formReports}
                  thisMonthReports={thisMonthReports}
                  previousMonthReports={previousMonthReports}
                  setMonth={setMonth}
                  setYear={setYear}
                  barReports={barReports}
                  initializedBar={initializedBar}
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
