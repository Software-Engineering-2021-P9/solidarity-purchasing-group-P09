import React from "react";
import {
  Container,
  Card,
  CardImg,
  Row,
  Col,
  Button,
  ProgressBar,
} from "react-bootstrap";
import { iconPackaging, iconCart } from "../icons";
import "./ProductCard.css";
import "bootstrap/dist/css/bootstrap.min.css";
import ImageService from "../../services/ImageService/ImageService";

function ProductCard(props) {
  const product = props.product;

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
              {" "}
              <Card.Title className="card-title">{product.name}</Card.Title>
            </Col>
            <Col className="product-price">{product.availability.price} €</Col>{" "}
          </Row>

          <Row className="mb-3">
            <Card.Text className="text">
              {iconPackaging} Packaging: {product.availability.packaging}
            </Card.Text>
          </Row>
          <Row className="description">
            <Card.Text className="text">{product.description}</Card.Text>
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
          {props.creatingOrderMode ? (
            <Row className="justify-content-center">
              <Col xs="auto">
                <Button
                  className="add-to-cart-button"
                  onClick={() => props.handleShow(product)}
                >
                  Add to cart{"       "}
                  {iconCart}
                </Button>
              </Col>
            </Row>
          ) : (
            ""
          )}
        </Card.Footer>
      </Card>
    </Container>
  );
}

export default ProductCard;
