import { Row, Col, FormControl, InputGroup } from "react-bootstrap";
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
        <Col sm={{ span: 6, order: "first" }} md={{ span: 3 }} lg={{ span: 4 }}>
          <RedDropdown
            items={Object.values(Product.Categories)}
            title={props.category ? props.category : "Categories"}
            updateSelectedItem={props.handleCategoryChanged}
            activeElement={props.category}
          />
        </Col>
        <Col md={{ offset: 2 }} xs={{ order: "first" }}>
          <InputGroup
            classname='padding'
            onSubmit={(ev) => props.handleFormSubmit(ev)}
          >
            <FormControl
              type='textarea'
              placeholder='Filter'
              value={props.text}
              onChange={(ev) => props.setText(ev.target.value)}
            />

            <Button onClick={props.handleOnSearchSubmit}> Search </Button>
          </InputGroup>
        </Col>
        <hr className='line' />
      </Row>
    </>
  );
}

export { FilterRow };
