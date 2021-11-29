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

export async function createClient(client) {
  const response = await fetch("http://localhost:3000/api/clients", {
    method: "POST",
    headers: { "Content-Type": "application/json" },

    body: JSON.stringify({ ...client }),
  });

  switch (response.status) {
    case 400:
      throw new Error("Validation error occurred");
    case 200:
      let responseBody;
      responseBody = await response.json();
      return ClientInfoResult.fromJSON(responseBody);
    default:
      throw new Error("An error occurred during client fetch");
  }
}

export async function signupClient(client) {
  const response = await fetch("http://localhost:3000/api/clients/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },

    body: JSON.stringify({ ...client }),
  });

  switch (response.status) {
    case 400:
      throw new Error("Validation error occurred");
    case 200:
      let responseBody;
      responseBody = await response.json();
      return ClientInfoResult.fromJSON(responseBody);
    default:
      throw new Error("An error occurred during client fetch");
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

export async function getOrders(clientID) {
  // Returns mock data right now

  let response = await fetch("/api/orders?clientID=" + clientID);

  switch (response.status) {
    case 200:
      let responseBody = await response.json();
      return responseBody.map((order) => Order.fromJSON(order));
    case 400:
      throw new Error(
        "Bad request: the request contained invalid parameter " + clientID
      );
    case 401:
      throw new Error("Unauthorized");
    case 500:
      throw new Error("Internal Server Error");
    default:
      throw new Error("An error occurred during orders search");
  }
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
