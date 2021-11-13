import React, { useEffect, useState } from "react";
import { Container, Card, CardImg, Row, Col } from "react-bootstrap";
import eggs from "../../assets/eggs.jpg";
import fruit from "../../assets/fruit.jpg";
import creams from "../../assets/spreadableCreams.jpg";
import meat from "../../assets/meat.jpg";
import milk from "../../assets/milk.jpg";
import vegetables from "../../assets/vegetables.jpg";
import Product from "../../services/models/Product";

function ProductCard(props) {
  const [product, setProduct] = useState([]);

  useEffect(() => {
    setProduct(props.product);
  }, [props.product]);

  const selectImage = (category) => {
    let toReturn;
    switch (category) {
      case Product.Categories.Eggs:
        toReturn = eggs;
        break;
      case Product.Categories.Milk:
        toReturn = milk;
        break;

      case Product.Categories.Meat:
        toReturn = meat;
        break;

      case Product.Categories.SpreadableCreams:
        toReturn = creams;
        break;

      case Product.Categories.Fruit:
        toReturn = fruit;
        break;

      case Product.Categories.Vegetables:
        toReturn = vegetables;
        break;
    }

    return toReturn;
  };

  return (
    <Container>
      <Card>
        <CardImg src={selectImage(props.product.category)} />
        <Card.Body>
          <Card.Title>{product.name}</Card.Title>
          <Row>
            <Col>
              <Card.Text>
                {product.description} {"\n"}
                Price: 1$
              </Card.Text>
            </Col>
          </Row>
        </Card.Body>
        <Card.Footer>
          <small className="text-muted">Last updated 3 mins ago</small>
        </Card.Footer>
      </Card>
    </Container>
  );
}

export default ProductCard;
