import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState } from 'react';
import { Container, Row } from "react-bootstrap";

import { NavbarComponent } from "../ui-components/NavbarComponent/NavbarComponent";
import {ShoppingCartTitle} from '../ui-components/ShoppingCartComponent/ShoppingCartTitle';
import {ShoppingCartTable} from '../ui-components/ShoppingCartComponent/ShoppingCartTable';
import {ShoppingCartTotAmount} from '../ui-components/ShoppingCartComponent/ShoppingCartTotAmount';
import {ShoppingCartControls} from '../ui-components/ShoppingCartComponent/ShoppingCartControls';

function ShoppingCartPage(props) {
    // nelle props, ShoppingCartPage riceve 
    //      - la mappa <Item, Qty>
    //      - il cliente
    // function totalAmount
    // chiama la funzione getProductById

    const staticCart = [
        // id, description, important, private, deadline
        { id: 1, item: "Eggplant", description: "Origin: Italy, packaging: 1kg", price: 2.50, quantity: 1 },
        { id: 2, item: "Zucchini", description: "Origin: Italy, packaging: 1kg", price: 3, quantity: 2 },
        { id: 3, item: "Eggs", description: "Origin: Italy, packaging: 6 eggs", price: 1.60, quantity: 3 },
        { id: 4, item: "Milk", description: "Origin: Italy, packaging: 2l", price: 1, quantity: 4 }
    ];

    const staticClient = "Will Smith";

    const [tot, setTot] = useState(staticCart.reduce((partial_sum, a) => partial_sum + (a.price * a.quantity), 0));

    const updateAmount = (singleAmount) => {
        setTot(tot + singleAmount);
    }

    return (
        <Container>
            <Row>
                <NavbarComponent />
            </Row>
            <Row>
                <ShoppingCartTitle staticClient={staticClient}/>
            </Row>
            <Row>
                <ShoppingCartTable cart={staticCart} updateAmount={updateAmount} />
            </Row>
            <Row >
               <ShoppingCartTotAmount tot={tot}/>
            </Row>
            <Row>
                <ShoppingCartControls/>
            </Row>
        </Container>
    )
}

export { ShoppingCartPage };

