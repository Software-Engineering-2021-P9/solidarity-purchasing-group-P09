import React, { useState } from "react";
import { PopUpForCompleteOrder } from "./PopUpForCompleteOrder";
import "./ClientOrderTableRow.css";
import Button from "../Button/Button";
import { updateStatus } from "../../services/ApiClient";
function ClientOrderTableRow(props) {
  const [status, setStatus] = useState(props.order.status);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const handleSubmit = () => {
    updateStatus(status).then((newS) => {
      setStatus(newS);
    });
    setModalIsOpen(false);
  };

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
        {status === "PREPARED" ? (
          <td className='table-row-status-prepared'>{status}</td>
        ) : (
          <td className='table-row-status-done'>{status}</td>
        )}

        {status === "PREPARED" ? (
          <td>
            <Button onClick={() => setModalIsOpen(true)}>
              {" "}
              Change Status{" "}
            </Button>
          </td>
        ) : (
          <td className='table-row'></td>
        )}
      </tr>
    </>
  );
}

export { ClientOrderTableRow };
