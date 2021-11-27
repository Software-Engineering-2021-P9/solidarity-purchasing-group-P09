import React, { useState, useEffect } from "react";
import { ClientOrderTableRow } from "./ClientOrderTableRow";
import { Table } from "react-bootstrap";
import "./ClientOrders.css";
import { getOrders } from "../../services/ApiClient";
import { useHistory } from "react-router";

function ClientOrders(props) {
  const [orders, setOrders] = useState([]);
  const history = useHistory();

  useEffect(() => {
    // getOrder retrieves mock data!
    getOrders().then((newO) => {
      /*if(history.location.pathname === "/NotCoveredOrders"){
        setOrders(newO.filter(order => order.status === "NOT COVERED"));
      }
      else{*/
        setOrders(newO);
      //}
    });
  }, []);

  return (
    <div>
      <h3 className='header-orders'>Client Previous Orders</h3>
      <Table borderless className='table-orders'>
        <thead className='border-bottom'>
          <tr>
            <th>Order Code</th>
            <th>Amount</th>
            <th>Date</th>
            <th>Pick up location</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <ClientOrderTableRow key={order.id} order={order} />
          ))}
        </tbody>
      </Table>
    </div>
  );
}

export { ClientOrders };
