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

/* MOCK getClientById*/

export function getClientByID(clientID) {
  const json = {
    id: clientID,
    fullName: "Giovanni Salviati",
    phoneNumber: "3203688561",
    email: "xyvz@gmail.com",
    address: "via Giovanni da Verazzano,2 Torino,10538",
    wallet: 0,
  };
  return Client.fromJSON(json);
}
