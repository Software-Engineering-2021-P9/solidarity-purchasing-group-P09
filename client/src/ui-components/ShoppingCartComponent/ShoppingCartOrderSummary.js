import "bootstrap/dist/css/bootstrap.min.css";
import "./ShoppingCartOrderSummaryCSS.css";
import React from "react";
import { Container, Col, Row, Card, Form, FloatingLabel} from "react-bootstrap";
import  Divider from "../Divider/Divider";
import Button from "../Button/Button";
import { OrderRecapRow } from "./OrderRecapRow";

function checkboxShipmentComponent(props){
    return <div className="form-check">
                <input onChange={()=>{
                    if(props.deliveryType==="Pickup" || props.deliveryType===""){//i.e. if from "pickup" to "shipment", then clear the address field
                        props.setDeliveryAddress("")
                        props.setAmount(props.amount + 20);
                    }
                    props.setDeliveryType("Shipment");}} 
                    className="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault1"
                />
                <label className="form-check-label" for="flexCheckDefault">
                    Shipment
                </label>
            </div>;
}

function checkboxPickupComponent(props){
    return <div className="form-check">
                <input onChange={()=>{
                    if(props.deliveryType==="Shipment"){//i.e. if from "shipment" to "pickup", then remove fee
                        props.setAmount(props.amount -20);
                    }
                    props.setDeliveryType("Pickup");
                    props.setDeliveryAddress("Skylab, Via Washington 35, Pizzo Calabro (Store Address)")
                }} 
                    className="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault2"
                />
                <label className="form-check-label" for="flexCheckChecked">
                    Pickup
                </label>
            </div>;
}

function addressComponent(props){
    let address;

    switch(props.deliveryType){
        case("Shipment"):
        address =   <Form.Group className="mb-3">
                        <FloatingLabel
                            controlId="floatingInput"
                            label="Address"
                            className="mb-3"
                        >
                            <Form.Control onChange={(event)=>{props.setDeliveryAddress(event.target.value)}} type="text" className="cart-order-summary-form" placeholder="Address"/>
                        </FloatingLabel>
                    </Form.Group>
        break;

        case("Pickup"):
            address = <h6>Skylab, Via Washington 35, Pizzo Calabro (Store Address)</h6>;
        break;

        default:
            address = null;
    }
    return address;
}

function ShoppingCartOrderSummary(props) {

    let checkboxShipment = checkboxShipmentComponent(props);   
    let checkboxPickup = checkboxPickupComponent(props);
    let address = addressComponent(props);
    let orderSummary = props.products.map((item)=>{
        return (
            <OrderRecapRow
              product={item}
              quantity={props.cart.get(item.id)}
              key={item.id}
            />
          );
    });

    return (
    <Card className="cart-order-summary">
        <h1 className="cart-order-summary-title"> ORDER SUMMARY</h1>
        
        <Container fluid>
            <Divider/>
                {orderSummary}
                    <Row className='d-flex justify-content-between px-2 py-1'>
                        <Col>Fees</Col>
                        <Col className='align-end'>{props.deliveryType==="Shipment"?"20 €":"0 €"}</Col>
                    </Row>
                <Row>
                    <Col><h5 className="cart-order-summary-price">{"total:"}</h5></Col>
                    <Col><h5 className="cart-order-summary-price">{"€ "+props.amount}</h5></Col>
                </Row>
            <Divider/>
            <Form>
                <Form.Group className="mb-3">
                    <Row>
                        <Col>
                            {checkboxShipment}
                        </Col>
                        <Col>
                            {checkboxPickup}
                        </Col>
                    </Row>
                </Form.Group>

                {address}

                <Form.Group className="mb-3">
                    <Form.Label>Date and Time</Form.Label>
                    <Form.Control onChange={(event)=>{props.setDeliveryDate(event.target.value)}} type="date" placeholder="Enter address" className="cart-order-summary-form"/>
                    <Form.Control onChange={(event)=>{props.setDeliveryTime(event.target.value)}} type="time" placeholder="Enter address" className="cart-order-summary-form"/>
                </Form.Group>

                <Form.Group className="mb-3">
                    {
                    //disable "create order button" if one of these is true:
                    //never hit checkboxes, no date, no time, no address
                    }
                    <Row>
                        <Button onClick={props.handleShow} disabled={props.deliveryType==="" || !props.deliveryDate || !props.deliveryTime || !props.deliveryAddress} className="cart-button-placeorder">
                            PLACE ORDER
                        </Button>
                    </Row>
                </Form.Group>
            </Form>
        </Container>

    </Card>
  );
}

export { ShoppingCartOrderSummary };
