import { Col, Container, Row, Spinner } from "react-bootstrap";
import ClientInfoListItem from "./ClientInfoListItem";

function ClientInfoList(props) {
  function getEmptyListText() {
    if (props.clientInfoList === null)
      return "Search for a registered client using the form above.\nClients can be retrieved using one between: email, name, address and phone number.";
    if (props.clientInfoList?.length === 0) return "No client found";
    return "";
  }

  return (
    <Container>
      <Col>
        {props.isLoading ? (
          <Container className="pt-5 d-flex justify-content-center">
            <Spinner variant="dark" animation="border" />
          </Container>
        ) : (
          <>
            {getEmptyListText() !== "" ? (
              <Row className="justify-content-center pt-3">
                <Col sm="6">
                  {getEmptyListText()
                    .split("\n")
                    .map((line) => (
                      <h4 className="title text-center">{line}</h4>
                    ))}
                </Col>
              </Row>
            ) : (
              <Row md={3} sm={3} xs={1} className="my-3 d-flex ">
                {props.clientInfoList?.map((item, index) => (
                  <Col>
                    <ClientInfoListItem
                      key={"client-info-item-" + index}
                      clientInfo={item}
                      onClick={() => props.onItemClick(index)}
                    />
                  </Col>
                ))}
              </Row>
            )}
          </>
        )}
      </Col>
    </Container>
  );
}

export default ClientInfoList;
