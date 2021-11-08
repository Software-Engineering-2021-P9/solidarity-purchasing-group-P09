import React, { useState } from "react";
import { Container, Row, Col, Alert, Button, Spinner, DropdownButton, Dropdown, Form, FormControl, CardGroup } from "react-bootstrap";
import { createBootstrapComponent } from "react-bootstrap/esm/ThemeProvider";
import ProductCard from "./ProductCard";

/* TODO: delete this function once this page is connected with back-end*/
class Product {
    constructor(name, description, price, category) {
        this.name = name;
        this.description = description;
        this.price = price;
        this.category = category;
    }
}



function ProductListPage() {

    const categories = ['fruit', 'vegetables', 'spreadable creams', 'meat', 'eggs', 'milk'];
    /* TODO: Retrieve this products from back-end*/
    const [products, setProducts] = useState([new Product("Zucchini", "Origin: Italy", "4,50", "vegetables"),
    new Product("Bananas", "Origin: Italy", "4,50", "vegetables")
    ]);
    return (
        <Container>
            <h1>Available products</h1>

            <Row >
                <Col>
                    <DropdownButton title="CATEGORIES">
                        {
                            categories.map((name, index) => <Dropdown.Item key={index}> {name} </Dropdown.Item>)
                        }
                        <Dropdown.Item > All </Dropdown.Item>
                    </DropdownButton>
                </Col>

                <Col>
                    <Form>
                        <Row>
                            <Col>
                                <FormControl type="text" placeholder="Filter" />
                            </Col>
                            <Col>
                                <Button> Search </Button>
                            </Col>
                        </Row>
                    </Form>
                </Col>
            </Row>

            <Row>
                {
                    products.map((item, index) => {
                        return (
                            <CardGroup as={Col}>
                                <ProductCard product={item} />
                            </CardGroup>
                        );
                    })
                }

            </Row>
        </Container>
    );
}

export default ProductListPage;
