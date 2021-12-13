import React from "react";
import { Form, Container } from "react-bootstrap";
import "./CreateProductForm.css";
import Product from "../../services/models/Product";
import Button from "../Button/Button";
function CreateProductForm(props) {
  const handleChange = (e) => {
    props.setCreatedProduct({
      ...props.createdProduct,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <Container>
      <h1 className="title">Create Product</h1>
      <Container className="createProductForm">
        <Form onSubmit={props.handleSubmit}>
          <Form.Group
            className="mb-3"
            value={props.createdProduct.name}
            onChange={handleChange}
          >
            <Form.Label>Name</Form.Label>
            <Form.Control
              required
              name="name"
              type="text"
              placeholder="Enter name of the product"
              maxLength="35"
            />
          </Form.Group>

          <Form.Group
            className="mb-3"
            value={props.createdProduct.description}
            onChange={handleChange}
          >
            <Form.Label>Description</Form.Label>
            <Form.Control
              required
              name="description"
              as="textarea"
              placeholder="Enter some description for product"
              rows={3}
              maxLength="100"
            />
          </Form.Group>
          <Form.Group
            className="mb-3"
            value={props.createdProduct.category}
            onChange={handleChange}
          >
            <Form.Text className="text-muted">
              Please choose your products category.
            </Form.Text>
            <Form.Select name="category" aria-label="Default select example">
              {Object.keys(Product.Categories).map((key) => {
                return (
                  <option key={key} value={Product.Categories[key]}>
                    {Product.Categories[key]}{" "}
                  </option>
                );
              })}
            </Form.Select>
          </Form.Group>
          <Button variant="primary" type="submit">
            Submit
          </Button>
        </Form>
      </Container>
    </Container>
  );
}

export default CreateProductForm;
