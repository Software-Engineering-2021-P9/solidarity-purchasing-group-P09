import Employee from "./models/Employee";
import Product from "./models/Product";
import Client from "./models/Client";
import Order from "./models/Order"; 

// --------
// Employee
// --------

export async function getEmployeeByID(employeeID) {
  const response = await fetch("/api/employees/" + employeeID);

  switch (response.status) {
    case 400:
      throw new Error("Validation error occurred");
    case 200:
      let responseBody;
      responseBody = await response.json();
      return Employee.fromJSON(responseBody);
    default:
      throw new Error("An error occurred during employee fetch");
  }
}

export async function getOrders() {
  // Returns mock data right now

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
      status: "PREPARED",
      totalPrice: 31,
      location: "corso Duca degli Abruzzi, 129, Torino",
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
      status: "DONE",
      totalPrice: 14,
      location: "corso Duca degli Abruzzi, 129, Torino",
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
      status: "PREPARED",
      totalPrice: 7,
      location: "corso Duca degli Abruzzi, 129, Torino",
      createdAt:
        new Date().getUTCMonth() +
        1 +
        "-" +
        new Date().getUTCDate() +
        "-" +
        new Date().getUTCFullYear(),
    },
    {
      id: "118f10ce364006b8655df032",
      clientId: "918d971d89d6240eb03742d7",
      products: [{ productId: "118d971d89d6240eb03742d7", quantity: 3 }],
      status: "PREPARED",
      totalPrice: 15,
      location: "corso Duca degli Abruzzi, 129, Torino",
      createdAt:
        new Date().getUTCMonth() +
        1 +
        "-" +
        new Date().getUTCDate() +
        "-" +
        new Date().getUTCFullYear(),
    },
  ];

  return mockOrders;
}

export async function updateStatus(status) {
  // again another mock function for frontend
  if (status === "PREPARED") {
    return "DONE";
  }
}

// --------
// Order
// --------

export async function createOrder(clientID, products) {
  var obj = { clientID: clientID, products: products };

  const response = await fetch("/api/orders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...obj }),
  });

  switch (response.status) {
    case 400:
      throw new Error("Validation error occurred");
    case 200:
      let responseBody;
      responseBody = await response.json();
      return Order.fromJSON(responseBody);
    default:
      throw new Error("An error occurred during order fetch");
  }
}

// --------
// Product
// --------

export async function getProductByID(productID) {
  const response = await fetch("/api/products?ids=" + productID);
  switch (response.status) {
    case 400:
      throw new Error("Validation error occurred");
    case 200:
      let responseBody;
      responseBody = await response.json();
      return Product.fromJSON(responseBody[0]);
    default:
      throw new Error("An error occurred during product fetch");
  }
}

// --------
// Client
// --------

export async function getClientByID(clientID) {
  const response = await fetch("/api/clients/" + clientID);
  switch (response.status) {
    case 400:
      throw new Error("Validation error occurred");
    case 200:
      let responseBody;
      responseBody = await response.json();
      return Client.fromJSON(responseBody);
    default:
      throw new Error("An error occurred during client fetch");
  }
}

// --------
// products
// --------

export async function findProducts(category, searchString) {
  let urlRequest = "/api/products?";

  if (searchString) {
    urlRequest += "searchString=" + searchString;
  }
  if (searchString && category) {
    urlRequest += "&";
  }
  if (category) {
    urlRequest += "category=" + category;
  }

  const response = await fetch(urlRequest);
  switch (response.status) {
    case 400:
      throw new Error("Validation error occurred");
    case 200:
      let responseBody;
      responseBody = await response.json(); 
      return responseBody.map((product) => Product.fromJSON(product));
    default:
      throw new Error("An error occurred during product fetch");
  }
}
