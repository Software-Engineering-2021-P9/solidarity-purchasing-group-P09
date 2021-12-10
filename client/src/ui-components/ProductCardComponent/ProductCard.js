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
  let left_availability = 14; //mock left_availability
  let dropdown_items = [];
  for (let i = 1; i < 11; i++) {
    if (i <= left_availability) {
      dropdown_items.push(i);
    }
  }

  return (
    <Container className="px-2">
      <Card className="card">
        <CardImg
          src={ImageService.returnImageByCategory(product.category)}
          className="card-img"
        />
        <Card.Body className="body">
          <div className="min-height mx-0 px-0">
            <Row className="d-flex justify-content-between mb-1">
              <Col xs="8" sm="7">
                <Card.Title className="card-title">{product.name}</Card.Title>
              </Col>
              <Col className="product-price" sm="5" xs="4">
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
          </div>

          <Row className="mt-4 progressbar-row">
            {props.shoppingCart.get(product.id) ? (
              <>
                <ProgressBar
                  now={left_availability - props.shoppingCart.get(product.id)}
                  max={product.availability.quantity}
                  variant={"progressbar"}
                  className="px-0"
                />
                <p>
                  <b>
                    {left_availability - props.shoppingCart.get(product.id)}{" "}
                    left
                  </b>{" "}
                  of {product.availability.quantity} available
                </p>
              </>
            ) : (
              <>
                <ProgressBar
                  now={left_availability}
                  max={product.availability.quantity}
                  variant={"progressbar"}
                  className="px-0"
                />
                <p>
                  <b>{left_availability} left</b> of{" "}
                  {product.availability.quantity} available
                </p>
              </>
            )}
          </Row>
        </Card.Body>

        {props.creatingOrderMode && (
          <Card.Footer className="footer">
            <Row className="justify-content-center d-flex align-items-center">
              {props.shoppingCart.get(product.id) ? (
                <>
                  <Col
                    className="px-0 mx-0 d-flex justify-content-center"
                    sm="2"
                    xs="1"
                  >
                    {iconCartEmptySmall}
                  </Col>
                  {(left_availability <= 10 ||
                    props.shoppingCart.get(product.id) < 10) && (
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
                          if (i === 10 && left_availability > 10)
                            return (
                              <option value={i}>
                                {i}
                                {"+"}
                              </option>
                            );
                          else return <option value={i}>{i}</option>;
                        })}
                      </Form.Select>
                    </Col>
                  )}
                  {left_availability > 10 &&
                    props.shoppingCart.get(product.id) >= 10 && (
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
                          max={left_availability}
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
