import { useState } from "react";
import { Col, Container, Form, Row, Spinner } from "react-bootstrap";
import Button from "../Button/Button";

const positiveFloatRegex = /^[+]?([0-9]+(?:[.][0-9]*)?|\.[0-9]+)$/;

function ProductAvailabilityForm(props) {
  const [price, setPrice] = useState("");
  const [packaging, setPackaging] = useState("");
  const [quantity, setQuantity] = useState("");

  function onPriceChange(event) {
    const newVal = event.target.value;

    if (newVal === "" || newVal.match(positiveFloatRegex)) {
      setPrice(newVal);
      return;
    }
  }

  function onQuantityChange(event) {
    const newVal = event.target.value;

    if (newVal === "" || newVal.match(positiveFloatRegex)) {
      setQuantity(newVal);
      return;
    }
  }

  function onPackagingChange(event) {
    const newVal = event.target.value;

    if (newVal === "" || newVal.trim() !== "") {
      setPackaging(() => newVal);
      return;
    }
  }

  function onSubmit(e) {
    e.preventDefault();
    props.onSubmit({
      price: parseFloat(price),
      packaging: packaging,
      quantity: parseInt(quantity),
    });
  }

  return (
    <>
      <Form onSubmit={onSubmit}>
        <Form.Group as={Row} className='mb-3'>
          <Form.Label column sm='3'>
            Price
          </Form.Label>
          <Col sm='8'>
            <Form.Control
              required
              min='0'
              placeholder='10€'
              value={price}
              onChange={onPriceChange}
            />
          </Col>
        </Form.Group>

        <Form.Group as={Row} className='mb-3'>
          <Form.Label column sm='3'>
            Packaging
          </Form.Label>
          <Col sm='8'>
            <Form.Control
              required
              placeholder='2lt, 1kg, 6 pcs, 4 units'
              maxLength='12'
              value={packaging}
              onChange={onPackagingChange}
            />
          </Col>
        </Form.Group>

        <Form.Group as={Row} className='mb-3'>
          <Form.Label column sm='3'>
            Quantity
          </Form.Label>
          <Col sm='8'>
            <Form.Control
              required
              min='0'
              placeholder='25'
              value={quantity}
              onChange={onQuantityChange}
            />
          </Col>
        </Form.Group>

        <Container className='d-flex justify-content-center'>
          <Button variant='primary' type='submit'>
            {props.isLoading ? (
              <span className='px-3'>
                <Spinner variant='light' animation='border' size='sm' />
              </span>
            ) : (
              "Confirm"
            )}
          </Button>
        </Container>
      </Form>
    </>
  );
}

export default ProductAvailabilityForm;
