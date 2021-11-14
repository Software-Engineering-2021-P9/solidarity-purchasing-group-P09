import React, { useEffect, useState } from "react";
import { Container, Card, CardImg, Row, Col } from "react-bootstrap";
import returnImage from "../../../services/RequestImages";

import "./ProductCard.css";
import "bootstrap/dist/css/bootstrap.min.css";

function ProductCard(props) {
  const product = props.product;

  useEffect(() => {}, [props.product]);

  return (
    <Container>
      <Card>
        <CardImg src={returnImage(product.category)} />
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
