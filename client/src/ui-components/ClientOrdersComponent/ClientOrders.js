import React from "react";
import { ClientOrderTableRow } from "./ClientOrderTableRow";
import { Table } from "react-bootstrap";
import "./ClientOrders.css";
function ClientOrders(props) {
  return (
    <div className="container-orders">
      <h3 className="header-orders">Client Previous Orders</h3>
      <Table className="table-orders">
        <thead>
          <tr>
            <th>Order Code</th>
            <th>Amount</th>
            <th>Date</th>
            <th>Pick up location</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {props.orders.map((order) => (
            <ClientOrderTableRow key={order.id} order={order} />
          ))}
        </tbody>
      </Table>
    </div>
  );
}

export { ClientOrders };
