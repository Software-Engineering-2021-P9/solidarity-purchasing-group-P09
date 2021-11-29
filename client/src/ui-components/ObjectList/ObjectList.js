import { Col, Container, Row, Spinner } from "react-bootstrap";
import ObjectListHeader from "./ObjectListHeader";
import ObjectListItem from "./ObjectListItem";

function ObjectList(props) {
  return (
    <Container>
      <Col>
        {!props.hideHeader && (
          <ObjectListHeader headerLabels={props.headerLabels} />
        )}
        {props.isLoading ? (
          <Container className='pt-5 d-flex justify-content-center'>
            <Spinner variant='dark' animation='border' />
          </Container>
        ) : (
          <>
            {props.emptyListText && props.emptyListText !== "" ? (
              <Row className='justify-content-center pt-3'>
                <Col sm='6'>
                  {props.emptyListText.split("\n").map((line) => (
                    <h4 className='title text-center'>{line}</h4>
                  ))}
                </Col>
              </Row>
            ) : (
              <>
                {props.items?.map((item, index) => (
                  <span
                    key={"object-info-item-" + index}
                    onClick={() => props.onItemClick(index)}>
                    <ObjectListItem item={item} />
                  </span>
                ))}
              </>
            )}
          </>
        )}
      </Col>
    </Container>
  );
}

export default ObjectList;
