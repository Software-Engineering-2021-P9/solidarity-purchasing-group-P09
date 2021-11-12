import 'bootstrap/dist/css/bootstrap.min.css';
import './ShoppingCartTotAmountCSS.css';
import React from 'react';

function ShoppingCartTotAmount(props) {

    return (
        <div className="total-amount">
            <h4>Total amount: {props.tot.toFixed(2)}</h4>
        </div>
    );
}

export { ShoppingCartTotAmount };