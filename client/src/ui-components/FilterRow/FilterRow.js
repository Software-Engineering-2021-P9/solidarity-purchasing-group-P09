import { Row, Col, Form, FormControl } from "react-bootstrap";
import Product from "../../services/models/Product";
import { RedDropdown } from "../RedDropdownComponent/RedDropdown";
import Button from "../Button/Button";
import "./FilterRow.css";
function FilterRow(props) {
  return (
    <>
      <Row className='align-items-center'>
        <h1 className='title'>Available products</h1>
      </Row>

      <Row className='sticky'>
        <Col
          xs={{ span: 6 }}
          sm={{ span: 6 }}
          md={{ span: 3 }}
          lg={{ span: 4 }}
        >
          <RedDropdown
            items={Object.values(Product.Categories)}
            title={props.category ? props.category : "Categories"}
            updateSelectedItem={props.handleCategoryChanged}
            activeElement={props.category}
          />
        </Col>
        <Col md={{ offset: 2 }}>
          <Form onSubmit={(ev) => props.handleFormSubmit(ev)}>
            <Row>
              <Col>
                <FormControl
                  type='textarea'
                  placeholder='Filter'
                  value={props.text}
                  onChange={(ev) => props.setText(ev.target.value)}
                />
              </Col>
              <Col md={{ span: 3 }}>
                <Button onClick={props.handleOnSearchSubmit}> Search </Button>
              </Col>
            </Row>
          </Form>
        </Col>
        <hr className='line' />
      </Row>
    </>
  );
}

export { FilterRow };
