import React, { useState } from "react";
import { PopUpForCompleteOrder } from "./PopUpForCompleteOrder";
import "./ClientOrderTableRow.css";
import Button from "../Button/Button";
import { updateStatus } from "../../services/ApiClient";
import { useHistory } from "react-router";
import  Order  from "../../services/models/Order"

function setupStatusLabelAndRowButton(location, status, setModalIsOpen){
  let tableRowComponents = {
    statusLabel: <td className='table-row-status-not-covered'>{"invalid status"}</td>,
    rowButton: <td className='table-row'></td>
  };

  switch(status){
    case(Order.OrderStatus.PREPARED):
      tableRowComponents.statusLabel = <td className='table-row-status-prepared'>{status}</td>;
      if(location !== "/NotCoveredOrders")
        tableRowComponents.rowButton = 
          <td className='table-row'>
            <Button onClick={() => setModalIsOpen(true)}>Change Status</Button>
          </td>
      break;

    case(Order.OrderStatus.NOT_COVERED):
      tableRowComponents.statusLabel = <td className='table-row-status-not-covered'>{status}</td>; 
      break;
    
      case(Order.OrderStatus.DONE):
      tableRowComponents.statusLabel = <td className='table-row-status-done'>{status}</td>; 
      break;

      case(Order.OrderStatus.WAITING):
      tableRowComponents.statusLabel = <td className='table-row-status-waiting'>{status}</td>; 
      break;

    default:
      break;
  }
  return tableRowComponents;
}

function ClientOrderTableRow(props) {
  const history = useHistory();

  const [status, setStatus] = useState(props.order.status);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const handleSubmit = () => {
    updateStatus(status).then((newS) => {
      setStatus(newS);
    });
    setModalIsOpen(false);
  };

  let tableRowComponents = setupStatusLabelAndRowButton(history.location.pathname, status, setModalIsOpen);

  return (
    <>
      <PopUpForCompleteOrder
        handleSubmit={handleSubmit}
        modalIsOpen={modalIsOpen}
        setModalIsOpen={setModalIsOpen}
      />
      <tr className='border-bottom'>
        <td className='table-row'>{props.order.id}</td>
        <td className='table-row'>{props.order.totalPrice}€</td>
        <td className='table-row'> {props.order.createdAt}</td>
        <td className='table-row'> {props.order.location}</td>
        {tableRowComponents.statusLabel}
        {tableRowComponents.rowButton}
      </tr>
    </>
  );
}

export { ClientOrderTableRow };
