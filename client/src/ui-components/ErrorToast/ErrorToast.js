import { Toast, ToastContainer } from "react-bootstrap";

function ErrorToast(props) {
  return (
    <>
      {props.errorMessage && (
        <ToastContainer position='bottom-start' className='p-3'>
          <Toast autohide onClose={props.onClose}>
            <Toast.Header>
              <strong>Error</strong>
            </Toast.Header>
            <Toast.Body>{props.errorMessage}</Toast.Body>
          </Toast>
        </ToastContainer>
      )}
    </>
  );
}

export default ErrorToast;
