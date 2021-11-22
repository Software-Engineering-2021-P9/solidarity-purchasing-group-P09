import React from "react";
import { Container, Card, CardImg, Row, Col, Button } from "react-bootstrap";

import "./ProductCard.css";
import "bootstrap/dist/css/bootstrap.min.css";
import ImageService from "../../services/ImageService/ImageService";

function ProductCard(props) {
  const product = props.product;

  return (
    <Container>
      <Card>
        <CardImg src={ImageService.returnImageByCategory(product.category)} />
        <Card.Body className="body">
          <Card.Title className="card-title">{product.name}</Card.Title>
          <Row>
            <Col>
              <Card.Text className="text">
                {product.description}
                <br />
                Packaging: 1Kg MOCK
                <br />
                Price: {product.price} € MOCK
              </Card.Text>
            </Col>
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
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="#635f46"
                    class="bi bi-cart-plus"
                    viewBox="0 0 16 16"
                  >
                    <path d="M9 5.5a.5.5 0 0 0-1 0V7H6.5a.5.5 0 0 0 0 1H8v1.5a.5.5 0 0 0 1 0V8h1.5a.5.5 0 0 0 0-1H9V5.5z" />
                    <path d="M.5 1a.5.5 0 0 0 0 1h1.11l.401 1.607 1.498 7.985A.5.5 0 0 0 4 12h1a2 2 0 1 0 0 4 2 2 0 0 0 0-4h7a2 2 0 1 0 0 4 2 2 0 0 0 0-4h1a.5.5 0 0 0 .491-.408l1.5-8A.5.5 0 0 0 14.5 3H2.89l-.405-1.621A.5.5 0 0 0 2 1H.5zm3.915 10L3.102 4h10.796l-1.313 7h-8.17zM6 14a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm7 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
                  </svg>
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
