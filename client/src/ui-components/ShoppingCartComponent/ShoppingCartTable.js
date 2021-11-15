import "bootstrap/dist/css/bootstrap.min.css";
import "./ShoppingCartTableCSS.css";
import React, { useState, useEffect } from "react";
import { Table } from "react-bootstrap";

function ShoppingCartTable(props) {
  return (
    <Table responsive="sm">
      <thead className="table-heading">
        <tr>
          <th>Item</th>
          <th>Description</th>
          <th>Packaging</th>
          <th>Price</th>
          <th>Quantity</th>
          <th>Total</th>
        </tr>
      </thead>
      <tbody>
        {Array.from(props.cart.entries()).map((entry) => {
          const [key, val] = entry;
          return (
            <CartRow
              getProductByID={props.getProductByID}
              productID={key}
              quantity={val}
              updateQuantity={props.updateQuantity}
              key={key}
            ></CartRow>
          );
        })}
      </tbody>
    </Table>
  );
}

function CartRow(props) {
  const [product, setProduct] = useState({});

  useEffect(() => {
    const getProduct = () => {
      props.getProductByID(props.productID).then(function (res) {
        setProduct(res);
      });
    };
    getProduct();
  }, [props]);

  return (
    <tr>
      <td className="item-cart">{product.name}</td>
      <td>{product.description}</td>
      <td>{product.packaging}</td>
      <td>
        {product.price}
        {" €"}
      </td>
      <td>
        <span
          onClick={() => {
            props.updateQuantity(product.id, -1);
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            class="bi bi-dash-square"
            viewBox="0 0 16 16"
          >
            <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z" />
            <path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8z" />
          </svg>
        </span>
        <span className="mx-2">{props.quantity}</span>
        <span
          onClick={() => {
            props.updateQuantity(product.id, 1);
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            class="bi bi-plus-square"
            viewBox="0 0 16 16"
          >
            <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z" />
            <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
          </svg>
        </span>
      </td>
      <td>
        {(product.price * props.quantity).toFixed(2)}
        {" €"}
      </td>
    </tr>
  );
}
export { ShoppingCartTable };
