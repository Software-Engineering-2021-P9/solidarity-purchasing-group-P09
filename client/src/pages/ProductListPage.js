import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import { Container, Row } from "react-bootstrap";
import { NavbarComponent } from "../ui-components/NavbarComponent/NavbarComponent";

function ProductListPage(props) {

    return (
        <Container>
            <Row>
                <NavbarComponent cart={1} />
                {/*cart prop receives the length of the items list in shopping cart */}
            </Row>
            <Row>
                <h1>ProductListPage</h1>
            </Row>
        </Container>
    )
}

export { ProductListPage };