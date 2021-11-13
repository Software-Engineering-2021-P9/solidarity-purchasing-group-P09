import React from "react";
import { ClientOrderTableRow } from "./ClientOrderTableRow";
import { Table } from "react-bootstrap";
function ClientOrders(props) {
  return (
    <div style={{ marginTop: "80px" }}>
      <h3>Client Previous Orders</h3>
      <Table striped bordered>
        <thead>
          <tr>
            <th>Order Code</th>
            <th>Amount</th>
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
