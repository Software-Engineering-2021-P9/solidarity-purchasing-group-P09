import "bootstrap/dist/css/bootstrap.min.css";
import "./ShoppingCartTitleCSS.css";
import React,{useState, useEffect} from "react";

function ShoppingCartTitle(props) {
  const [client, setClient] = useState({});

  useEffect(() => {
    const getClient = () => {
      props.getClientByID(props.client).then(function (res) {
        setClient(res);
      });
    };
    getClient();
  }, [props]);

  return (
    <div className="title mt-5">
      <h1>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="50"
          height="50"
          className="cart-icon"
          fill="#635F46"
          class="bi bi-cart4"
          viewBox="0 0 16 16"
        >
          <path d="M0 2.5A.5.5 0 0 1 .5 2H2a.5.5 0 0 1 .485.379L2.89 4H14.5a.5.5 0 0 1 .485.621l-1.5 6A.5.5 0 0 1 13 11H4a.5.5 0 0 1-.485-.379L1.61 3H.5a.5.5 0 0 1-.5-.5zM3.14 5l.5 2H5V5H3.14zM6 5v2h2V5H6zm3 0v2h2V5H9zm3 0v2h1.36l.5-2H12zm1.11 3H12v2h.61l.5-2zM11 8H9v2h2V8zM8 8H6v2h2V8zM5 8H3.89l.5 2H5V8zm0 5a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm-2 1a2 2 0 1 1 4 0 2 2 0 0 1-4 0zm9-1a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm-2 1a2 2 0 1 1 4 0 2 2 0 0 1-4 0z" />
        </svg>
        {client.fullName}'s cart
      </h1>
    </div>
  );
}

export { ShoppingCartTitle };