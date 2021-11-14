import React from "react";
import { Container, Card, CardImg, Row, Col } from "react-bootstrap";

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
                Price: 1 € MOCK
              </Card.Text>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default ProductCard;
