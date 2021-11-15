import { Col, Container, Row, Spinner } from "react-bootstrap";
import ClientInfoListHeader from "./ClientInfoListHeader";
import ClientInfoListItem from "./ClientInfoListItem";

function ClientInfoList(props) {
  function getEmptyListText() {
    if (props.clientInfoList === null)
      return "Use the form above to search for a registered client";
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
                {getEmptyListText()}
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
