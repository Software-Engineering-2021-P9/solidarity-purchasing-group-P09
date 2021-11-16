import "bootstrap/dist/css/bootstrap.min.css";
import "./ShoppingCartTableCSS.css";
import React, { useState, useEffect } from "react";
import { Table } from "react-bootstrap";
import ImageService from "../../services/ImageService/ImageService";

function ShoppingCartTable(props) {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const getProducts = () => {
      const keys = Array.from( props.cart.keys() );
      props.getProductsByIDs(keys).then(function (res) {
        console.log(res);
        setProducts(res);
      });
    };
    getProducts();
  }, [props]);

  return (
    <Table responsive="sm" borderless>
      <thead className="table-heading">
        <tr>
          <th>Category</th>
          <th>Item</th>
          <th>Description</th>
          <th>Packaging</th>
          <th>Price</th>
          <th>Quantity</th>
          <th>Total</th>
        </tr>
      </thead>
      <tbody>
        {products.map((item) => {
          return (
            <CartRow
              product={item}
              quantity={props.cart.get(item.id)}
              updateQuantity={props.updateQuantity}
              key={item.id}
            ></CartRow>
          );
        })}
      </tbody>
    </Table>
  );
}

function CartRow(props) {
  return (
    <tr>
      <td>
        <img
          alt=""
          width="100"
          src={ImageService.returnImageByCategory(props.product.category)}
        />
      </td>
      <td className="item-cart">{props.product.name}</td>
      <td>{props.product.description}</td>
      <td>{props.product.packaging}</td>
      <td>
        {props.product.price}
        {" €"}
      </td>
      <td>
        <span
          onClick={() => {
            props.updateQuantity(props.product.id, -1, props.product.price);
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
            props.updateQuantity(props.product.id, 1, props.product.price);
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
        {(props.product.price * props.quantity).toFixed(2)}
        {" €"}
      </td>
    </tr>
  );
}
export { ShoppingCartTable };