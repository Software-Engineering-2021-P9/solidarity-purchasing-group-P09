import "bootstrap/dist/css/bootstrap.min.css";
import "./ShoppingCartOrderSummaryCSS.css";
import React from "react";
import { Container, Col, Row, Card, Form, FloatingLabel} from "react-bootstrap";
import  Divider from "../Divider/Divider";


function ShoppingCartOrderSummary(props) {

    let checkboxShipment =     
    <div className="form-check">
        <input onChange={()=>{
            if(props.deliveryType==="Pickup")//i.e. if from "pickup" to "shipment", then clear the address field
                props.setDeliveryAddress("")
            props.setDeliveryType("Shipment");}} 
            className="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault1"
        />
        <label className="form-check-label" for="flexCheckDefault">
            Shipment
        </label>
    </div>;

    let checkboxPickup =
    <div className="form-check">
        <input onChange={()=>
                {props.setDeliveryType("Pickup");
                 props.setDeliveryAddress("Skylab, Via Washington 35, Pizzo Calabro (Store Address)")}} 
                className="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault2"
        />
        <label className="form-check-label" for="flexCheckChecked">
            Pickup
        </label>
    </div>;

    return (
    <Card className="cart-order-summary">
        <h1 className="cart-order-summary-title"> ORDER SUMMARY</h1>
        
        <Container>
            <Divider/>

            <Form>
                <Form.Group className="mb-3">
                <Container>
                <Row>
                    <Col><h5>{props.tot+" items"}</h5></Col>
                    <Col><h5 className="cart-order-summary-price">{props.tot+"€"}</h5> </Col>
                </Row>
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

                {props.deliveryType!=="Shipment"?null:
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
                    {
                    //hide "create order button" if one of these is true:
                    //never hit checkbox, no date, no time, no address
                    (props.deliveryType==="" || !props.deliveryDate || !props.deliveryTime || !props.deliveryAddress )?
                    null:props.controlsComponent
                    }
                </Form.Group>
            </Form>
        </Container>
    </Card>
  );
}

export { ShoppingCartOrderSummary };
