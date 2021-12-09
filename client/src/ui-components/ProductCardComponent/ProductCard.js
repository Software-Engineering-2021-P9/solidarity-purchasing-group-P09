import React from "react";
import {
  Container,
  Card,
  CardImg,
  Row,
  Col,
  Button,
  ProgressBar,
  Form,
  FormControl,
} from "react-bootstrap";
import {
  iconPackaging,
  iconCartPlus,
  iconDelete,
  iconCartEmptySmall,
} from "../icons";
import "./ProductCard.css";
import "bootstrap/dist/css/bootstrap.min.css";
import ImageService from "../../services/ImageService/ImageService";

function ProductCard(props) {
  const product = props.product;
  let dropdown_items = [];
  for (let i = 1; i < 10; i++) {
    dropdown_items.push(i);
  }

  return (
    <Container className="px-2">
      <Card className="card">
        <CardImg
          src={ImageService.returnImageByCategory(product.category)}
          className="card-img"
        />
        <Card.Body className="body">
          <Row className="d-flex justify-content-between mb-1">
            <Col xs="auto">
              <Card.Title className="card-title">{product.name}</Card.Title>
            </Col>
            <Col className="product-price" sm={{ span: 0, offset: 1 }}>
              {product.availability.price} €
            </Col>
          </Row>

          <Row className="mb-3 pt-1">
            <Card.Text className="card-text">
              {iconPackaging}
              <span className="packaging-text">
                Packaging: {product.availability.packaging}
              </span>
            </Card.Text>
          </Row>
          <Row className="description">
            <Card.Text className="card-text">{product.description}</Card.Text>
          </Row>
          <Row className="mt-4 progressbar-row">
            <ProgressBar
              now={32}
              max={product.availability.quantity}
              variant={"progressbar"}
              className="px-0"
            />
            <p>
              <b>32 left</b> of {product.availability.quantity} available
            </p>
          </Row>
        </Card.Body>

        {props.creatingOrderMode && (
          <Card.Footer className="footer">
            <Row className="justify-content-center d-flex align-items-center">
              {props.shoppingCart.get(product.id) ? (
                <>
                  <Col
                    className="px-0 d-flex justify-content-center"
                    sm="2"
                    xs="1"
                  >
                    {iconCartEmptySmall}
                  </Col>
                  {props.shoppingCart.get(product.id) < 10 ? (
                    <Col
                      sm="auto"
                      xs="4"
                      className="px-0 d-flex justify-content-center"
                    >
                      <Form.Select
                        className="form-input-gt10"
                        size="sm"
                        value={props.shoppingCart.get(product.id)}
                        onChange={(e) => {
                          props.addItem(product.id, e.target.value);
                        }}
                      >
                        {dropdown_items.map((i) => {
                          return <option value={i}>{i}</option>;
                        })}
                        <option value="10">10+</option>
                      </Form.Select>
                    </Col>
                  ) : (
                    <Col
                      sm="auto"
                      xs="4"
                      className="px-0 d-flex justify-content-center"
                    >
                      <FormControl
                        className="form-input-gt10"
                        type="number"
                        size="sm"
                        step={1}
                        value={props.shoppingCart.get(product.id)}
                        onChange={(e) => {
                          props.addItem(product.id, e.target.value);
                        }}
                        max={100}
                        min={1}
                      />
                    </Col>
                  )}
                  <Col className="d-flex justify-content-center" sm="2" xs="1">
                    <span
                      className="delete-icon"
                      onClick={() => props.deleteItem(product.id)}
                    >
                      {iconDelete}
                    </span>
                  </Col>
                </>
              ) : (
                <Button
                  className="add-to-cart-button"
                  onClick={() => {
                    props.addItem(product.id, 1);
                  }}
                >
                  Add to cart
                  <span className="ml-2">{iconCartPlus}</span>
                </Button>
              )}
            </Row>
          </Card.Footer>
        )}
      </Card>
    </Container>
  );
}

export default ProductCard;
