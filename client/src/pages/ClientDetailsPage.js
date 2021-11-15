import React from "react";
import { Container, Row } from "react-bootstrap";
import { NavbarComponent } from "../ui-components/NavbarComponent/NavbarComponent";
import { employeeNavbarLinks } from "../Routes";
import { ClientOrders } from "../ui-components/ClientOrdersComponent/ClientOrders";

import "bootstrap/dist/css/bootstrap.min.css";

function ClientDetailsPage(props) {
  // mock order list for completing orders part!
  const mockOrders = [
    {
      id: "618f10ce364006b8655df032",
      clientId: "918d971d89d6240eb03742d7",
      products: [
        { productId: "718d971d89d6240eb03742d7", quantity: 10 },
        { productId: "298d971d89d6240eb03742d7", quantity: 1 },
        { productId: "318d971d89d6240eb03742d7", quantity: 2 },
        { productId: "418d971d89d6240eb03742d7", quantity: 3 },
      ],
      status: "WAITING",
      totalPrice: 31,
      createdAt:
        new Date().getUTCMonth() +
        1 +
        "-" +
        new Date().getUTCDate() +
        "-" +
        new Date().getUTCFullYear(),
    },

    {
      id: "718f10ce364006b8655df032",
      clientId: "918d971d89d6240eb03742d7",
      products: [
        { productId: "718d971d89d6240eb03742d7", quantity: 10 },
        { productId: "298d971d89d6240eb03742d7", quantity: 1 },
        { productId: "318d971d89d6240eb03742d7", quantity: 2 },
        { productId: "418d971d89d6240eb03742d7", quantity: 3 },
      ],
      status: "COMPLETED",
      totalPrice: 14,
      createdAt:
        new Date().getUTCMonth() +
        1 +
        "-" +
        new Date().getUTCDate() +
        "-" +
        new Date().getUTCFullYear(),
    },

    {
      id: "818f10ce364006b8655df032",
      clientId: "918d971d89d6240eb03742d7",
      products: [{ productId: "718d971d89d6240eb03742d7", quantity: 3 }],
      status: "WAITING",
      totalPrice: 7,
      createdAt:
        new Date().getUTCMonth() +
        1 +
        "-" +
        new Date().getUTCDate() +
        "-" +
        new Date().getUTCFullYear(),
    },
  ];
  return (
    <Container>
      <Row>
        <NavbarComponent links={employeeNavbarLinks} />
      </Row>
      <Row>
        <h1>ClientDetailsPage</h1>
      </Row>
      <Row>
        <ClientOrders orders={mockOrders} />
      </Row>
    </Container>
  );
}

export { ClientDetailsPage };
