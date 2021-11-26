import React, { useState } from "react";
import { PopUpForCompleteOrder } from "./PopUpForCompleteOrder";
import "./ClientOrderTableRow.css";
import { RedButton } from "../RedButtonComponent/RedButton";
import { updateStatus } from "../../services/ApiClient";
import { useHistory } from "react-router";

function setupStatusLabelAndRowButton(location, status, setModalIsOpen){
  let tableRowComponents = {
    statusLabel: null,
    rowButton: null
  };

  switch(status){
    case("PREPARED"):
      tableRowComponents.statusLabel = <td className='table-row-status-prepared'>{status}</td>;
      if(location !== "/NotCoveredOrders")
        tableRowComponents.rowButton = 
          <td className='table-row'><RedButton text='Change Status' onClick={() => setModalIsOpen(true)}/></td>
      break;

    case("NOT COVERED"):
      tableRowComponents.statusLabel = <td className='table-row-status-not-covered'>{status}</td>; 
      /*if(location !== "/NotCoveredOrders")
        tableRowComponents.rowButton = 
          <td className='table-row'><RedButton text='Cover Order' onClick={() =>{}}/></td>;*/
      break;

    default:
      tableRowComponents.statusLabel = <td className='table-row-status-done'>{status}</td>;
      tableRowComponents.rowButton = <td className='table-row'></td>;
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
