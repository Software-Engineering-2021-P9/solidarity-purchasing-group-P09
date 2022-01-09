import { Modal, Button, Row, Col } from "react-bootstrap";
import { alertIcon } from "../../ui-components/icons";
import { useHistory } from "react-router";
function AlertPopUp(props) {
  const history = useHistory();
  return (
    <Modal centered show={props.conditions}>
      <Modal.Header>
        <div className="margin-auto center-text">
          <Modal.Title className="margin-auto">
            <Row>
              <Col xs={2}> {alertIcon}</Col>
              <Col xs={10} className="d-flex align-items-center">
                {" "}
                {props.title}
              </Col>
            </Row>{" "}
          </Modal.Title>
        </div>
      </Modal.Header>

      <Modal.Body>
        <p className="center-text">{props.body1}</p>
        <p className="center-text">{props.body2}</p>
      </Modal.Body>

      <Modal.Footer>
        <div className="margin-auto">
          <Button
            className="product-list-page-popup-buttons"
            variant="primary"
            onClick={() => {
              props.setAsShown(true);
              props.setCurrentlyMissingPickUpAlertShown(
                !props.currentlyMissingPickUpAlertShown
              );
            }}
          >
            Close
          </Button>
        </div>
        <div className="margin-auto">
          <Button
            className="product-list-page-popup-buttons"
            variant="primary"
            onClick={() => {
              history.push("/client");
            }}
          >
            Check Orders
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
}

export { AlertPopUp };
