import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect, useState } from "react";
import { Card, Col, Row, Button, Spinner, Container } from "react-bootstrap";
import {
  getCurrentWeekphase,
  setWeekphaseOverride,
} from "../services/ApiClient";
import ErrorToast from "../ui-components/ErrorToast/ErrorToast";

function TestPanelPage() {
  const weekphasesConfig = [
    { id: "weekphase-1", from: "00000", to: "02300" },
    { id: "weekphase-2", from: "02300", to: "10900" },
    { id: "weekphase-3", from: "10900", to: "22200" },
    { id: "weekphase-4", from: "22200", to: "30000" },
    { id: "weekphase-5", from: "30000", to: "30900" },
    { id: "weekphase-6", from: "30900", to: "51200" },
    { id: "weekphase-7", from: "51200", to: "52200" },
    { id: "weekphase-8", from: "52200", to: "60900" },
    { id: "weekphase-9", from: "60900", to: "70000" }, // SUN 00:00 must be set as 70000
  ];

  const farmerActions = {
    "Can confirm availability (Current week)": [0, 1, 8],
    "Can deliver products (Current week)": [2],
    "Can report availability (Next week)": [4, 5, 6, 7],
  };

  const clientActions = {
    "Can make orders (Next week)": [0, 4, 5, 6, 7, 8],
    "Can update pickup time (Next week)": [0, 4, 5, 6, 7, 8],
    "Can update pickup time (Current week)": [1, 2, 3, 4, 5],
  };

  const employeeActions = {
    "Can make orders (Next week)": [0, 4, 5, 6, 7, 8],
    "Can update pickup time (Next week)": [0, 4, 5, 6, 7, 8],
    "Can update pickup time (Current week)": [1, 2, 3, 4, 5],
    "Can handout orders (Current week)": [5, 6],
  };

  const autoActions = {
    "Not confirmed farmers' estimations are rejected": [2],
    "Orders are paid": [2],
  };

  const [isInitialized, setIsInitialized] = useState(false);
  const [mustReload, setMustReload] = useState(true);
  const [requestError, setRequestError] = useState("");
  const [currentWeekphaseID, setCurrentWeekphaseID] = useState(null);

  useEffect(() => {
    const loadData = () => {
      getCurrentWeekphase().then((weekphaseID) => {
        setCurrentWeekphaseID(weekphaseID);
        setIsInitialized(true);
        setMustReload(false);
      });
    };

    if (mustReload) loadData();
  }, [mustReload]);

  function getAllowedActionsList(actions, weekphase) {
    let allowedActions = [];
    for (const [action, weekphases] of Object.entries(actions)) {
      if (
        weekphases.includes(
          weekphasesConfig.findIndex((w) => w.id === weekphase)
        )
      )
        allowedActions.push(action);
    }
    if (!allowedActions.length) allowedActions.push("None");
    return allowedActions;
  }

  function buildAllowedActionsList(userLabel, userActions, weekphase) {
    return (
      <>
        <Card.Subtitle>{userLabel}</Card.Subtitle>
        <Card.Text>
          {getAllowedActionsList(userActions, weekphase).map((a) => (
            <span>
              {a}
              <br />
            </span>
          ))}
        </Card.Text>
      </>
    );
  }

  function parseWeekphaseBoundary(boundary) {
    const dayOfWeek = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];

    const dowIndex = boundary.substring(0, 1);
    const hours = boundary.substring(1, 3);
    const minutes = boundary.substring(3, 5);
    return dayOfWeek[dowIndex] + " " + hours + ":" + minutes;
  }

  function buildWeekphaseInterval(weekphase) {
    return (
      parseWeekphaseBoundary(weekphase.from) +
      " - " +
      parseWeekphaseBoundary(weekphase.to)
    );
  }

  function buildCurrentWeekphaseCard(weekphaseID) {
    return (
      <Card>
        <Card.Body>
          <Card.Title>
            {currentWeekphaseID === weekphaseID
              ? "Current phase"
              : "Next phase"}
          </Card.Title>
          <hr />
          <h5>
            {buildWeekphaseInterval(
              weekphasesConfig.find((wp) => wp.id === weekphaseID)
            )}
          </h5>
          <hr />
          {buildAllowedActionsList("Farmer", farmerActions, weekphaseID)}
          {buildAllowedActionsList("Client", clientActions, weekphaseID)}
          {buildAllowedActionsList("Employee", employeeActions, weekphaseID)}
          <hr />
          {buildAllowedActionsList(
            "Transition triggers",
            autoActions,
            weekphaseID
          )}
        </Card.Body>
      </Card>
    );
  }

  function getNextWeekphaseID() {
    let index = weekphasesConfig.findIndex(
      (wp) => wp.id === currentWeekphaseID
    );
    return weekphasesConfig[(index + 1) % weekphasesConfig.length].id;
  }

  function onNextPhaseButtonClick() {
    setWeekphaseOverride(getNextWeekphaseID())
      .then(() => {
        setMustReload(true);
      })
      .catch((err) => setRequestError(err.message));
  }

  function onResetButtonClick() {
    setWeekphaseOverride(null)
      .then(() => {
        setMustReload(true);
      })
      .catch((err) => setRequestError(err.message));
  }

  return (
    <>
      {!isInitialized ? (
        <Spinner />
      ) : (
        <>
          <Row className='mt-5 align-content-center'>
            <Col xs='6'>{buildCurrentWeekphaseCard(currentWeekphaseID)}</Col>
            <Col xs='6'>{buildCurrentWeekphaseCard(getNextWeekphaseID())}</Col>
          </Row>

          <Row className='mt-5 w-50 text-center'>
            Manually forcing the next phase will cause the system to enter an
            overridden state: the internal clock will be stopped and phase
            transitions won't happen.
            <br />
            <br />
            Use the reset button to remove the override.
          </Row>
          <Container className='mt-4 d-flex justify-content-center'>
            <Button onClick={onNextPhaseButtonClick}>Next Phase</Button>
            <Button className='ms-5' onClick={onResetButtonClick}>
              Reset
            </Button>
          </Container>
        </>
      )}
      <ErrorToast
        errorMessage={requestError}
        onClose={() => setRequestError("")}
      />
    </>
  );
}

export default TestPanelPage;
