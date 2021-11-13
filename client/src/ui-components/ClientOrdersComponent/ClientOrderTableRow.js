import React, { useState } from "react";
import "./ClientOrderTableRow.css";
function ClientOrderTableRow(props) {
  const [status, setStatus] = useState(props.order.status);

  const handleSubmit = () => {
    if (status === "WAITING") {
      setStatus("COMPLETED");
    } else if (status === "COMPLETED") {
      setStatus("WAITING");
    }
  };

  return (
    <tr>
      <td style={{ width: "300px" }}>{props.order.id}</td>
      <td style={{ width: "300px" }}>{props.order.totalPrice}€</td>
      {status === "WAITING" ? (
        <td style={{ width: "300px", color: "#FF9E0A" }}>{status}</td>
      ) : (
        <td style={{ width: "300px", color: "green" }}>{status}</td>
      )}

      <td>
        {" "}
        <button onClick={handleSubmit}>Change Status</button>
      </td>
    </tr>
  );
}

export { ClientOrderTableRow };
