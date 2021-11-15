import { Col, Container, Row, Spinner } from "react-bootstrap";
import ClientInfoListHeader from "./ClientInfoListHeader";
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
        <ClientInfoListHeader />
        {props.isLoading ? (
          <Container className='pt-5 d-flex justify-content-center'>
            <Spinner variant='dark' animation='border' />
          </Container>
        ) : (
          <>
            {getEmptyListText() !== "" ? (
              <Row className='justify-content-center pt-3'>
                <Col sm='6'>
                  {getEmptyListText()
                    .split("\n")
                    .map((line) => (
                      <div>{line}</div>
                    ))}
                </Col>
              </Row>
            ) : (
              <>
                {props.clientInfoList?.map((item, index) => (
                  <ClientInfoListItem
                    key={"client-info-item-" + index}
                    clientInfo={item}
                    onClick={() => props.onItemClick(index)}
                  />
                ))}
              </>
            )}
          </>
        )}
      </Col>
    </Container>
  );
}

export default ClientInfoList;
