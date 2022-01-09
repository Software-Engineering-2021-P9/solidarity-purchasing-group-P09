import { useState } from "react";
import { Col, Form, Modal, Row, Spinner } from "react-bootstrap";
import Button from "../Button/Button";

const positiveFloatRegex = /^[+]?([0-9]+(?:[.][0-9]*)?|\.[0-9]+)$/;

function ProductAvailabilityUpdateForm(props) {
  const [quantity, setQuantity] = useState(
    props.availability?.quantity.toString() || ""
  );

  function onQuantityChange(event) {
    const newVal = event.target.value;

    if (newVal === "" || newVal.match(positiveFloatRegex)) {
      setQuantity(newVal);
      return;
    }
  }

  function onSubmit(e) {
    e.preventDefault();
    props.onSubmit({
      quantity: parseInt(quantity),
    });
  }

  function onCancel() {
    props.onHide();
    setQuantity("");
  }

  return (
    <>
      <Modal centered show={props.show} onHide={onCancel}>
        <Modal.Header closeButton>
          <Modal.Title>Update Product Availability</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Remember that updating the availability of a product which has been
            already reserved could cause disservicies you are responsible for.
          </p>
          <Form id='update-pa-form' onSubmit={onSubmit}>
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
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button form='update-pa-form' type='submit'>
            {props.isLoading ? (
              <span className='px-3'>
                <Spinner variant='light' animation='border' size='sm' />
              </span>
            ) : (
              "Confirm"
            )}
          </Button>
          <Button variant='light' onClick={onCancel}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ProductAvailabilityUpdateForm;
