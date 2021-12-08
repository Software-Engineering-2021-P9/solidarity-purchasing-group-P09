import React, { useState } from "react";
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
  const [quantity, setQuantity] = useState(
    props.shoppingCart.get(product.id) | 0
  );

  return (
    <Container>
      <Card className="card">
        <CardImg
          src={ImageService.returnImageByCategory(product.category)}
          className="card-img"
        />
        <Card.Body className="body">
          <Row className="d-flex justify-content-between mb-1">
            <Col>
              <Card.Title className="card-title">{product.name}</Card.Title>
            </Col>
            <Col className="product-price">{product.availability.price} €</Col>{" "}
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
        <Card.Footer className="footer">
          {props.creatingOrderMode && (
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
                  {quantity < 10 ? (
                    <Col
                      sm="auto"
                      xs="4"
                      className="px-0 d-flex justify-content-center"
                    >
                      <Form.Select
                        className="form-input-gt10"
                        size="sm"
                        value={quantity}
                        onChange={(e) => {
                          console.log("e.target.value", e.target.value);
                          setQuantity(parseInt(e.target.value));
                          props.addItem(product.id, e.target.value);
                        }}
                      >
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                        <option value="6">6</option>
                        <option value="7">7</option>
                        <option value="8">8</option>
                        <option value="9">9</option>
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
                        value={quantity}
                        onChange={(e) => {
                          setQuantity(parseInt(e.target.value));
                          props.addItem(product.id, e.target.value);
                        }}
                        max={100}
                        min={9}
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
                    setQuantity(1);
                  }}
                >
                  Add to cart
                  <span className="ml-2 add-to-cart-icon">{iconCartPlus}</span>
                </Button>
              )}
            </Row>
          )}
        </Card.Footer>
      </Card>
    </Container>
  );
}

export default ProductCard;
