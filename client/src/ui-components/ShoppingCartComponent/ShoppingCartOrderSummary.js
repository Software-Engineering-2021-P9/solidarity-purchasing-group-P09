import "bootstrap/dist/css/bootstrap.min.css";
import "./ShoppingCartOrderSummaryCSS.css";
import React from "react";
import { Container, Col, Row, Card, Form, Button, FloatingLabel} from "react-bootstrap";
import  Divider from "../Divider/Divider";
import { useState} from "react";


function ShoppingCartOrderSummary(props) {

    let checkboxShipment =     
    <div className="form-check">
        <input onChange={()=>{props.setPickupIsChecked(false)}} className="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault1"/>
        <label className="form-check-label" for="flexCheckDefault">
            Shipment
        </label>
    </div>;

    let checkboxPickup =
    <div className="form-check">
        <input onChange={()=>{props.setPickupIsChecked(true)}} className="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault2"/>
        <label className="form-check-label" for="flexCheckChecked">
            Pickup
        </label>
    </div>;

    return (
    <Card className="cart-order-summary">
        <h1 className="cart-order-summary-title"> ORDER SUMMARY</h1>
        
        <Container>
            <Divider/>
            <Row>
                <Col><h5>{props.tot+" items"}</h5></Col>
                <Col><h5 className="cart-order-summary-price">{props.tot+"€"}</h5> </Col>
            </Row>

            <Form>
                <Form.Group className="mb-3">
                <Container>
                <Row>
                <Col>
                    {checkboxShipment}
                </Col>
                <Col>
                    {checkboxPickup}
                </Col>
                </Row>
                </Container>
                </Form.Group>

                {props.pickupIsChecked?null:
                <Form.Group className="mb-3">
                    <FloatingLabel
                        controlId="floatingInput"
                        label="Address"
                        className="mb-3"
                    >
                    <Form.Control onChange={(event)=>{props.setDeliveryAddress(event.target.value)}} type="text" className="cart-order-summary-form" placeholder="Address"/>

                    </FloatingLabel>
                </Form.Group>
                }

                <Form.Group className="mb-3">
                    <Form.Label>Date and Time</Form.Label>
                    <Form.Control onChange={(event)=>{props.setDeliveryDate(event.target.value)}} type="date" placeholder="Enter address" className="cart-order-summary-form"/>
                    <Form.Control onChange={(event)=>{props.setDeliveryTime(event.target.value)}} type="time" placeholder="Enter address" className="cart-order-summary-form"/>
                </Form.Group>
                <Form.Group className="mb-3">
                    {props.controlsComponent}
                </Form.Group>
            </Form>
        </Container>
    </Card>
  );
}

export { ShoppingCartOrderSummary };
