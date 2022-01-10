import React from "react";
import { ClientOrderTableRow } from "./ClientOrderTableRow";
import { Container, Col, Row } from "react-bootstrap";
import "./ClientOrders.css";
import {
  calendarIcon,
  cashIcon,
  listIcon,
  pinMapSmallIcon,
  statusIcon,
  shipmentIcon,
} from "../icons";
function ClientOrders(props) {
  return (
    <Container>
      <Row>
        <h3 className="header-orders">Client Previous Orders</h3>
      </Row>
      {props.orders.length > 0 ? (
        <Row className="bigger-font">
          <Col className="table-orders table-container mx-0 px-3">
            <Row className="table-header table-header-visibility mx-0 px-0">
              <Col md="3" lg="3" xl="3" className="mx-0 px-0">
                {listIcon} Order Code
              </Col>
              <Col className="mx-0 px-0">{cashIcon} Amount</Col>
              <Col md="2" lg="2" xl="2" className="mr-0 pr-0">
                {calendarIcon} Date
              </Col>
              <Col md="3" lg="3" xl="3" className="mx-0 px-0">
                {pinMapSmallIcon} Pick up | {shipmentIcon} Shipment
              </Col>
              <Col md="3" lg="3" xl="3" className="mx-0 px-0">
                {statusIcon} Status
              </Col>
            </Row>
            {props.orders.map((order) => (
              <ClientOrderTableRow
                loggedUser={props.loggedUser}
                key={order.id}
                order={order}
              />
            ))}
          </Col>
        </Row>
      ) : (
        <p className="no-orders">No orders</p>
      )}
    </Container>
  );
}

export { ClientOrders };
