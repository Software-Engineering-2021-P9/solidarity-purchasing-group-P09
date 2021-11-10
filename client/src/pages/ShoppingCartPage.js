import 'bootstrap/dist/css/bootstrap.min.css';
import './ShoppingCartPageCSS.css';
import React, {useState} from 'react';
import { Container, Row,Button  } from "react-bootstrap";
import { ShoppingCartTable } from "../ui-components/ShoppingCartTable";


function ShoppingCartPage(props) {
    // nelle props, ShoppingCartPage riceve 
    //      - la mappa <Item, Qty>
    //      - il cliente
    // function addQty
    // function removeQty
    // function totalAmount
    // chiama la funzione getProduct

    const staticCart = [
        // id, description, important, private, deadline
        { id: 1, item: "Eggplant", description: "Origin: Italy, packaging: 1kg", price: 2.50, quantity:1},
        { id: 2, item: "Zucchini", description: "Origin: Italy, packaging: 1kg", price: 3, quantity:2 },
        { id: 3, item: "Eggs", description: "Origin: Italy, packaging: 6 eggs", price: 1.60, quantity:3 },
        { id: 4, item: "Milk", description: "Origin: Italy, packaging: 2l", price: 1, quantity:4 }
    ];

    const [tot, setTot] = useState(staticCart.reduce((partial_sum, a) => partial_sum + (a.price*a.quantity), 0));

    const increaseAmount = (singleAmount)=>{
        setTot(tot+singleAmount); 
    }
    const decreaseAmount = (singleAmount)=>{
        setTot(tot-singleAmount); 
    }

    return (
        <Container>
            <Row className="title ">
                <h1><svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" className="cart-icon mx-2" fill="#635F46" class="bi bi-cart4" viewBox="0 0 16 16">
                    <path d="M0 2.5A.5.5 0 0 1 .5 2H2a.5.5 0 0 1 .485.379L2.89 4H14.5a.5.5 0 0 1 .485.621l-1.5 6A.5.5 0 0 1 13 11H4a.5.5 0 0 1-.485-.379L1.61 3H.5a.5.5 0 0 1-.5-.5zM3.14 5l.5 2H5V5H3.14zM6 5v2h2V5H6zm3 0v2h2V5H9zm3 0v2h1.36l.5-2H12zm1.11 3H12v2h.61l.5-2zM11 8H9v2h2V8zM8 8H6v2h2V8zM5 8H3.89l.5 2H5V8zm0 5a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm-2 1a2 2 0 1 1 4 0 2 2 0 0 1-4 0zm9-1a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm-2 1a2 2 0 1 1 4 0 2 2 0 0 1-4 0z" />
                </svg>{props.client}'s cart</h1>
            </Row>
            <Row>
                <ShoppingCartTable cart={staticCart} increaseAmount={increaseAmount} decreaseAmount={decreaseAmount}/>
            </Row>
            <Row className="d-flex total-amount">
                <h4>Total amount: {tot.toFixed(2)}</h4>
            </Row>
            <Row className="d-flex flex-row-reverse ">
                <Button className="cart-inverse-button">CONTINUE SHOPPING</Button>
                <Button className="cart-button">PLACE ORDER</Button>
            </Row>
        </Container>
    )
}

export { ShoppingCartPage };