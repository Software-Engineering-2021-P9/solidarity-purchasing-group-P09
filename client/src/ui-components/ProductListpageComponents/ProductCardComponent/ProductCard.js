import React, { useEffect, useState } from "react";
import { Container, Card, CardImg, Row, Col } from "react-bootstrap";
import returnImage from "../../../services/RequestImages";

import "./ProductCard.css";
import "bootstrap/dist/css/bootstrap.min.css";

function ProductCard(props) {
  const [product, setProduct] = useState([]);

  useEffect(() => {
    setProduct(props.product);
  }, [props.product]);

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
                Price: 1 € MOCK PRICE
              </Card.Text>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default ProductCard;
