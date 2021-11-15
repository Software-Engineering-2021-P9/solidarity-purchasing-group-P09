import { Modal, Spinner } from "react-bootstrap";
import Button from "../Button/Button";

function ActionConfirmationModal(props) {
  return (
    <Modal centered show={props.show} onHide={props.onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Action Confirmation Required</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>{props.message}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onConfirm}>
          {props.isLoading ? (
            <span className='px-3'>
              <Spinner variant='light' animation='border' size='sm' />
            </span>
          ) : (
            "Confirm"
          )}
        </Button>
        <Button variant='light' onClick={props.onCancel}>
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ActionConfirmationModal;
