import Employee from "./models/Employee";
import Product from "./models/Product";
import Client from "./models/Client";

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

// --------
// Order
// --------

export async function createOrder(clientID, products) {
  var obj = { clientID: clientID, products: products };

  await fetch("/api/orders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...obj }),
  });
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
      return Product.fromJSON(responseBody);
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
