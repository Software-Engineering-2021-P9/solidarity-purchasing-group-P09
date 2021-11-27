import EmployeeInfoResult from "./models/EmployeeInfoResult";
import ClientInfoResult from "./models/ClientInfoResult";
import FarmerInfoResult from "./models/FarmerInfoResult";
import Product from "./models/Product";
import Order from "./models/Order";
import UserRoles from "./models/UserRoles";

// ----
// Auth
// ----

export async function loginUser(email, password) {
  let response = await fetch("/api/users/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username: email, password: password }),
  });

  switch (response.status) {
    case 200:
      let responseBody = await response.json();

      switch (responseBody.role) {
        case UserRoles.CLIENT:
          return ClientInfoResult.fromJSON(responseBody);
        case UserRoles.EMPLOYEE:
          return EmployeeInfoResult.fromJSON(responseBody);
        case UserRoles.FARMER:
        default:
          return FarmerInfoResult.fromJSON(responseBody);
      }
    case 400:
      throw new Error("Validation error occurred");
    case 401:
      throw new Error("Unauthorized");
    case 500:
      throw new Error("Internal Server Error");
    default:
      throw new Error("An error occurred during user login");
  }
}

export async function getCurrentUser() {
  let response = await fetch("/api/users/current");

  switch (response.status) {
    case 200:
      let responseBody = await response.json();

      switch (responseBody.role) {
        case UserRoles.CLIENT:
          return ClientInfoResult.fromJSON(responseBody);
        case UserRoles.EMPLOYEE:
          return EmployeeInfoResult.fromJSON(responseBody);
        case UserRoles.FARMER:
        default:
          return FarmerInfoResult.fromJSON(responseBody);
      }
    case 204:
      return null;
    default:
      throw new Error("An error occurred during user login");
  }
}

export async function logoutUser() {
  let response = await fetch("/api/users/current", {
    method: "DELETE",
  });

  switch (response.status) {
    case 200:
    case 204:
      return;
    default:
      throw new Error("An error occurred during user login");
  }
}

// --------
// Employee
// --------

export async function getEmployeeByID(employeeID) {
  let response = await fetch("/api/employees/" + employeeID);

  switch (response.status) {
    case 400:
      throw new Error("Validation error occurred");
    case 200:
      let responseBody = await response.json();
      return EmployeeInfoResult.fromJSON(responseBody);
    default:
      throw new Error("An error occurred during employee fetch");
  }
}

// ------
// Client
// ------

export async function findClients(searchString) {
  let path = "/api/clients";
  if (searchString) path += `?searchString=${searchString}`;

  let response = await fetch(path);

  switch (response.status) {
    case 200:
      let responseBody = await response.json();
      return responseBody.map((clientJson) =>
        ClientInfoResult.fromJSON(clientJson)
      );
    case 400:
      throw new Error("Validation error occurred");
    case 401:
      throw new Error("Unauthorized");
    case 500:
      throw new Error("Internal Server Error");
    default:
      throw new Error("An error occurred during clients search");
  }
}

export async function getClientByID(clientID) {
  let response = await fetch("/api/clients/" + clientID);

  switch (response.status) {
    case 200:
      let responseBody = await response.json();
      return ClientInfoResult.fromJSON(responseBody);
    case 400:
      throw new Error("Validation error occurred");
    case 401:
      throw new Error("Unauthorized");
    case 500:
      throw new Error("Internal Server Error");
    default:
      throw new Error("An error occurred during clients search");
  }
}

export async function addFundToWallet(clientID, increaseBy) {
  const response = await fetch(`/api/clients/${clientID}/wallet`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ increaseBy: parseFloat(increaseBy) }),
  });

  switch (response.status) {
    case 200:
      // It returns an object containing the updated wallet amount:
      // { newWalletValue: 1023.23 }
      return response.json();
    case 400:
      throw new Error("Validation error occurred");
    case 401:
      throw new Error("Unauthorized");
    case 500:
      throw new Error("Internal Server Error");
    default:
      throw new Error("An error occurred during clients search");
  }
}

// --------
// Products
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
      throw new Error("An error occurred during employee fetch");
  }
}

// ------
// Orders
// ------

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
    {
      id: "118f10ce364006b8655df036",
      clientId: "918d971d89d6240eb03742d7",
      products: [{ productId: "118d971d89d6240eb03742d7", quantity: 3 }],
      status: "NOT COVERED",
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
    {
      id: "118f10ce364006bd655df000",
      clientId: "918d971d89d6240eb03742d7",
      products: [{ productId: "118d971d89d6240eb03742d7", quantity: 3 }],
      status: "NOT COVERED",
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

export async function getProductsByIDs(productIDs) {
  let productIDsString = productIDs.join(",");
  const response = await fetch("/api/products?ids=" + productIDsString);

  switch (response.status) {
    case 400:
      throw new Error("Validation error occurred");
    case 200:
      let responseBody;
      responseBody = await response.json();
      return responseBody.map((product) => Product.fromJSON(product));
    default:
      throw new Error("An error occurred during products fetch");
  }
}
