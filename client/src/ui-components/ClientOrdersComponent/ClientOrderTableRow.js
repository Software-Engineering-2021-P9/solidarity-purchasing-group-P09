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
import dayjs from "dayjs";
import UserRoles from "../../services/models/UserRoles";

function ClientOrderTableRow(props) {
  const [status, setStatus] = useState(props.order.status);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const handleSubmit = () => {
    updateStatus(status, props.order.id).then((newS) => {
      setStatus(newS);
    });
    setModalIsOpen(false);
  };

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
          {dayjs(props.order.createdAt).format("DD/MM/YYYY  hh:mm")}
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
            <Col className='d-flex align-items-center'>
              {status === Order.OrderStatus.DONE ? (
                <span className='table-row-status-done mx-0 px-0'>
                  {status}
                </span>
              ) : (
                <span className='table-row-status-prepared mx-0 px-0'>
                  {status}
                </span>
              )}
            </Col>
            {status === Order.OrderStatus.PREPARED &&
              props.loggedUser.role === UserRoles.EMPLOYEE && (
                <Col md='auto' lg='auto' xl='auto'>
                  <span className='d-flex justify-content-end'>
                    <span
                      className='px-1 change-status'
                      onClick={() => setModalIsOpen(true)}
                    >
                      COMPLETE
                    </span>
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
              {dayjs(props.order.createdAt).format("DD/MM/YYYY  hh:mm")}
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
            {status === Order.OrderStatus.DONE ? (
              <Col className='table-row-status-done d-flex align-items-center'>
                {status}
              </Col>
            ) : (
              <Col className='table-row-status-prepared d-flex align-items-center'>
                {status}
              </Col>
            )}
            {status === Order.OrderStatus.PREPARED &&
              props.loggedUser.role === UserRoles.EMPLOYEE && (
                <Col className='d-flex justify-content-end'>
                  <span
                    className='px-1 change-status'
                    onClick={() => setModalIsOpen(true)}
                  >
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
      {props.small && (
        <Col sm='auto' xs='auto'>
          {pinMapSmallIcon}
        </Col>
      )}
      <Col xs='auto'>{DayString(day)}</Col>
      <Col>
        {/*props.small &&*/ timeIcon} {hour}:{minute}{" "}
      </Col>
    </Row>
  );
}

function ShipmentSlot(props) {
  return (
    <Row>
      {props.small && (
        <Col sm='auto' xs='auto'>
          {shipmentIcon}
        </Col>
      )}

      <Col xs='auto'>{props.address}</Col>
    </Row>
  );
}
export { ClientOrderTableRow };
