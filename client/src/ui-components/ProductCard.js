import React, { useState } from "react";
import { Container, Card, CardImg, Row, Col, Button } from "react-bootstrap";

function ProductCard(props) {

    const [product, setProduct] = useState(props.product);
    return (
        <Container>
            <Card>
                <CardImg />
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
