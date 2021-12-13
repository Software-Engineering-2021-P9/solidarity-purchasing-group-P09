import { Row, Col, FormControl, InputGroup } from "react-bootstrap";
import Product from "../../services/models/Product";
import { RedDropdown } from "../RedDropdownComponent/RedDropdown";
import Button from "../Button/Button";
import "./FilterRow.css";
function FilterRow(props) {
  return (
    <>
      <Row className="align-items-center">
        <h1 className="title">Next week available products</h1>
      </Row>

      <Row className="sticky">
        <Col
          className="ms-auto padding"
          sm={{ span: 4, order: "first" }}
          xs={12}
        >
          <Row xs={12} sm={4}>
            <RedDropdown
              items={Object.values(Product.Categories)}
              title={props.category ? props.category : "Categories"}
              updateSelectedItem={props.handleCategoryChanged}
              activeElement={props.category}
            />
          </Row>
        </Col>
        <Col className="me-auto" xs={{ order: "first" }}>
          <InputGroup
            className="padding"
            onSubmit={(ev) => props.handleFormSubmit(ev)}
          >
            <FormControl
              type="textarea"
              placeholder="Filter"
              value={props.text}
              onChange={(ev) => props.setText(ev.target.value)}
            />

            <Button onClick={props.handleOnSearchSubmit}> Search </Button>
          </InputGroup>
        </Col>
        <hr className="line" />
      </Row>
    </>
  );
}

export { FilterRow };
