import React, { useState } from "react";
import { Col, Row } from "react-bootstrap";
import { PopUpForCompleteOrder } from "./PopUpForCompleteOrder";
import "./ClientOrderTableRow.css";
import { updateStatus } from "../../services/ApiClient";
import Order from "../../services/models/Order";
import {
  calendarIcon,
  cashIcon,
  listIcon,
  pinMapSmallIcon,
  statusIcon,
  shipmentIcon,
  timeIcon,
} from "../icons";
import UserRoles from "../../services/models/UserRoles";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);

function ClientOrderTableRow(props) {
  const [status, setStatus] = useState(props.order.status);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const handleSubmit = () => {
    updateStatus(status, props.order.id).then((newS) => {
      setStatus(newS);
    });
    setModalIsOpen(false);
  };

  let statusComponent = createStatusComponent(status);

  return (
    <Row className='my-3 px-0'>
      <PopUpForCompleteOrder
        handleSubmit={handleSubmit}
        modalIsOpen={modalIsOpen}
        setModalIsOpen={setModalIsOpen}
      />
      <Row className='mx-0 px-0 align-items-center table-cell-visibility'>
        <Col md='3' lg='3' xl='3' className='mx-0 px-3'>
          {props.order.id}
        </Col>
        <Col className='mx-0 px-0'>{props.order.totalPrice} €</Col>
        <Col md='2' lg='2' xl='2' className='mr-0 pr-0'>
          {dayjs(props.order.createdAt).local().format("DD/MM/YYYY  HH:mm")}
        </Col>
        <Col md='3' lg='3' xl='3' className='mx-0 px-0'>
          {props.order.shipmentInfo.type === "shipment" ? (
            <ShipmentSlot
              address={props.order.shipmentInfo.address}
              small={false}
            />
          ) : (
            <PickUpSlot
              pickUpSlot={props.order.shipmentInfo.pickUpSlot}
              small={false}
            />
          )}
        </Col>
        <Col md='3' lg='3' xl='3' className='mx-0 px-0'>
          <Row>
            <Col className='d-flex align-items-start'>{statusComponent}</Col>
            {status === Order.OrderStatus.PREPARED &&
              props.loggedUser.role === UserRoles.EMPLOYEE && (
                <Col className='d-flex justify-content-start'>
                  <span
                    className='px-0 mx-0 change-status'
                    onClick={() => setModalIsOpen(true)}>
                    COMPLETE
                  </span>
                </Col>
              )}
          </Row>
        </Col>
      </Row>
      <Row className='mx-0 px-0 container-sm table-cell-visibility-small smaller-font'>
        <Col md='12'>
          <Row>
            <Col sm='auto' xs='auto'>
              {listIcon}
            </Col>
            <Col className='small-text'>{props.order.id}</Col>
          </Row>
          <Row>
            <Col sm='auto' xs='auto'>
              {cashIcon}
            </Col>
            <Col>{props.order.totalPrice} €</Col>
          </Row>
          <Row>
            <Col sm='auto' xs='auto'>
              {calendarIcon}
            </Col>
            <Col>
              {" "}
              {dayjs(props.order.createdAt).local().format("DD/MM/YYYY  HH:mm")}
            </Col>
          </Row>
          <Row>
            <Col>
              {" "}
              {props.order.shipmentInfo.type === "shipment" ? (
                <ShipmentSlot
                  address={props.order.shipmentInfo.address}
                  small={true}
                />
              ) : (
                <PickUpSlot
                  pickUpSlot={props.order.shipmentInfo.pickUpSlot}
                  small={true}
                />
              )}
            </Col>
          </Row>
          <Row>
            <Col className='d-flex align-items-center' sm='auto' xs='auto'>
              {statusIcon}
            </Col>
            <Col className='d-flex align-items-center'>{statusComponent}</Col>
            {status === Order.OrderStatus.PREPARED &&
              props.loggedUser.role === UserRoles.EMPLOYEE && (
                <Col className='d-flex justify-content-start'>
                  <span
                    className='px-1 change-status mx-0'
                    onClick={() => setModalIsOpen(true)}>
                    COMPLETE
                  </span>
                </Col>
              )}
          </Row>
        </Col>
      </Row>
    </Row>
  );
}

function PickUpSlot(props) {
  const day = props.pickUpSlot.charAt(0);
  const hour = props.pickUpSlot.slice(1, 3);
  const minute = props.pickUpSlot.slice(3);
  const DayString = () => {
    switch (day) {
      case "3":
        return "Wednesday";

      case "4":
        return "Thursday";

      case "5":
        return "Friday";

      default:
        break;
    }
  };
  return (
    <Row>
      <Col sm='auto' xs='auto'>
        {pinMapSmallIcon}
      </Col>

      <Col xs='4' sm='2' md='4'>
        {DayString()}
      </Col>
      <Col className='d-flex align-items-center'>
        {timeIcon} &nbsp; {hour}:{minute}{" "}
      </Col>
    </Row>
  );
}

function ShipmentSlot(props) {
  return (
    <Row>
      <Col sm='auto' xs='auto'>
        {shipmentIcon}
      </Col>

      <Col xs='auto'>{props.address}</Col>
    </Row>
  );
}
function createStatusComponent(status) {
  let statusComponent;
  switch (status) {
    case Order.OrderStatus.NOT_COVERED:
      statusComponent = (
        <span className='table-row-status-not-covered mx-0 px-0'>{status}</span>
      );
      break;

    case Order.OrderStatus.WAITING:
      statusComponent = (
        <span className='table-row-status-waiting mx-0 px-0'>{status}</span>
      );
      break;

    case Order.OrderStatus.PREPARED:
      statusComponent = (
        <span className='table-row-status-prepared mx-0 px-0'>{status}</span>
      );
      break;

    case Order.OrderStatus.DONE:
      statusComponent = (
        <span className='table-row-status-done mx-0 px-0'>{status}</span>
      );
      break;

    case Order.OrderStatus.PENDINGCANCELATION:
      statusComponent = (
        <span className='table-row-status-pending-cancelation mx-0 px-0'>
          {status}
        </span>
      );
      break;

    case Order.OrderStatus.CONFIRMED:
      statusComponent = (
        <span className='table-row-status-pending-confirmed mx-0 px-0'>
          {status}
        </span>
      );
      break;

    case Order.OrderStatus.CANCELED:
      statusComponent = (
        <span className='table-row-status-canceled mx-0 px-0'>{status}</span>
      );
      break;

    case Order.OrderStatus.UNRETRIEVED:
      statusComponent = (
        <span className='table-row-status-pending-unretrieved mx-0 px-0'>
          {status}
        </span>
      );
      break;

    default:
      statusComponent = null;
      break;
  }
  return statusComponent;
}

export { ClientOrderTableRow };
