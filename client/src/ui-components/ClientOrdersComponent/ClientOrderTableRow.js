import React, { useState } from "react";
import { PopUpForCompleteOrder } from "./PopUpForCompleteOrder";
import "./ClientOrderTableRow.css";

function ClientOrderTableRow(props) {
  const [status, setStatus] = useState(props.order.status);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const handleSubmit = () => {
    if (status === "PREPARED") {
      setStatus("DONE");
    } else if (status === "DONE") {
      setStatus("PREPARED");
    }
    setModalIsOpen(false);
  };

  return (
    <>
      <PopUpForCompleteOrder
        handleSubmit={handleSubmit}
        modalIsOpen={modalIsOpen}
        setModalIsOpen={setModalIsOpen}
      />
      <tr>
        <td className="table-row">{props.order.id}</td>
        <td className="table-row">{props.order.totalPrice}€</td>
        <td className="table-row"> {props.order.createdAt}</td>
        <td className="table-row"> {props.order.location}</td>
        {status === "PREPARED" ? (
          <td className="table-row-status-prepared">{status}</td>
        ) : (
          <td className="table-row-status-done">{status}</td>
        )}

        {status === "PREPARED" ? (
          <td>
            <button onClick={() => setModalIsOpen(true)}>Change Status</button>
          </td>
        ) : (
          <td className="table-row"></td>
        )}
      </tr>
    </>
  );
}

export { ClientOrderTableRow };
