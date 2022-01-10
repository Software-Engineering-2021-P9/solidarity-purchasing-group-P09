import React, { useState, useEffect, useContext } from "react";
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

  const [week, setWeek] = useState(2);
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
      getWeeklyOrdersStat(2, 2022)
        .then((result) => {
          setThisWeekReports(result);
        })
        .catch((err) =>
          setRequestError("Failed to fetch this week reports: " + err.message)
        );
      // this month
      getWeekIntervalOrdersStat(1, 4, 2022, 2022)
        .then((result) => {
          setThisMonthReports(result);
        })
        .catch((err) =>
          setRequestError("Failed to fetch this month reports: " + err.message)
        );
      // previous week
      getWeeklyOrdersStat(1, 2022)
        .then((result) => {
          setPreviousWeekReports(result);
        })
        .catch((err) =>
          setRequestError(
            "Failed to fetch previous week reports: " + err.message
          )
        );
      // previous month
      getWeekIntervalOrdersStat(49, 52, 2021, 2021)
        .then((result) => {
          setPreviousMonthReports(result);
        })
        .catch((err) =>
          setRequestError(
            "Failed to fetch previous month reports: " + err.message
          )
        );
    };
    getGeneralReports();
  }, []);

  useEffect(() => {
    const getBarReports = async () => {
      if (typeReports === 0) {
        let map_week_bar = new Map();
        let year_week_bar = 2021;
        const weeks_week_bar = [45, 46, 47, 48, 49, 50, 51, 52, 1, 2];

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
        const weeks_month_bar = [17, 21, 25, 29, 33, 37, 41, 45, 49, 1];
        let cont = 0;
        for (const w of weeks_month_bar) {
          if (w === 1) {
            year_month_bar = 2022;
          }
          var res2 = await getWeekIntervalOrdersStat(
            w,
            w + 3,
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
  }, [typeReports]);

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
    if (typeReports === 1 && year === 2022 && month > 0) {
      setFormReports({});
    } else if (typeReports === 0 && year === 2022 && week > 2) {
      setFormReports({});
    } else {
      getFormReports();
    }
  }, [week, year, month, typeReports]);

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
            {typeReports === 0 ? (
              <>
                <WeeklyReports
                  week={week}
                  year={year}
                  formReports={formReports}
                  thisWeekReports={thisWeekReports}
                  previousWeekReports={previousWeekReports}
                  setWeek={setWeek}
                  setYear={setYear}
                  barReports={barReports}
                  initializedBar={initializedBar}
                />
              </>
            ) : (
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
