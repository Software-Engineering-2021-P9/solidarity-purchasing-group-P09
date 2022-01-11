import EmployeeInfoResult from "./models/EmployeeInfoResult";
import ClientInfoResult from "./models/ClientInfoResult";
import FarmerInfoResult from "./models/FarmerInfoResult";
import ManagerInfoResult from "./models/ManagerInfoResult";
import Product from "./models/Product";
import ProductAvailability from "./models/ProductAvailability";
import Order from "./models/Order";
import UserRoles from "./models/UserRoles";

// Builds the query parameters for an URL from the passed object
function buildQueryParametersString(queryParams) {
  if (Object.keys(queryParams).length === 0) {
    return "";
  }

  let queryParamsString = "?";

  for (const [key, value] of Object.entries(queryParams)) {
    queryParamsString += `${key}=${value}&`;
  }
  return queryParamsString.slice(0, -1);
}

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
        case UserRoles.MANAGER:
          return ManagerInfoResult.fromJSON(responseBody);
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
        case UserRoles.MANAGER:
          return ManagerInfoResult.fromJSON(responseBody);
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

export async function findClients(searchString, hasPendingCancelation) {
  let path = "/api/clients";

  if (searchString || hasPendingCancelation !== null) {
    path += "?";
    if (searchString) {
      path += `searchString=${searchString}&`;
    }
    if (hasPendingCancelation !== null) {
      path += `hasPendingCancelation=${hasPendingCancelation}&`;
    }
    path = path.substring(0, path.length - 1); //delete the last character, that is &
  }

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

// -------
// Product
// -------

export async function createProduct(product) {
  const response = await fetch("http://localhost:3000/api/products", {
    method: "POST",
    headers: { "Content-Type": "application/json" },

    body: JSON.stringify({ ...product }),
  });

  switch (response.status) {
    case 200:
      let responseBody;
      responseBody = await response.json();
      return Product.fromJSON(responseBody);
    case 400:
      throw new Error("Validation error occurred");
    case 401:
      throw new Error("Unauthorized");
    case 500:
      throw new Error("Internal Server Error");
    default:
      throw new Error("An error occurred during post createProduct request");
  }
}

export async function findProducts(category, searchString) {
  let urlRequest = "/api/products/available?";

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

export async function getFarmerProducts(
  farmerID,
  category = null,
  searchString = null,
  hasAvailabilitySet = null
) {
  var queryParams = {};
  if (category) queryParams["category"] = category;
  if (searchString) queryParams["searchString"] = searchString;
  if (hasAvailabilitySet !== null)
    queryParams["hasAvailabilitySet"] = hasAvailabilitySet;

  let response = await fetch(
    `/api/farmers/${farmerID}/products` +
      buildQueryParametersString(queryParams)
  );

  switch (response.status) {
    case 200:
      let responseBody = await response.json();
      return responseBody.map((productJson) => Product.fromJSON(productJson));
    case 400:
      throw new Error("Validation error occurred");
    case 401:
      throw new Error("Unauthorized");
    case 500:
      throw new Error("Internal Server Error");
    default:
      throw new Error("An error occurred during farmer products retrieval");
  }
}

export async function setNextWeekProductAvailability(
  productID,
  price,
  packaging,
  quantity
) {
  var obj = {
    price: parseFloat(price),
    packaging: packaging,
    quantity: parseInt(quantity),
  };

  const response = await fetch(`/api/products/${productID}/availability`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...obj }),
  });

  switch (response.status) {
    case 200:
      let responseBody = await response.json();
      return ProductAvailability.fromJSON(responseBody);
    case 400:
      throw new Error("Validation error occurred");
    case 401:
      throw new Error("Unauthorized");
    case 404:
      throw new Error("Not Found");
    case 500:
      throw new Error("Internal Server Error");
    default:
      throw new Error(
        "An error occurred setting product's next week availability"
      );
  }
}

export async function getCurrentWeekProductAvailability(productID) {
  const response = await fetch(
    `/api/products/${productID}/availability/currentWeek`
  );

  switch (response.status) {
    case 200:
      let responseBody = await response.json();
      return ProductAvailability.fromJSON(responseBody);
    case 400:
      throw new Error("Validation error occurred");
    case 401:
      throw new Error("Unauthorized");
    case 404:
      return null;
    case 500:
      throw new Error("Internal Server Error");
    default:
      throw new Error(
        "An error occurred retrieving product's current week availability"
      );
  }
}

export async function getNextWeekProductAvailability(productID) {
  const response = await fetch(
    `/api/products/${productID}/availability/nextWeek`
  );

  switch (response.status) {
    case 200:
      let responseBody = await response.json();
      return ProductAvailability.fromJSON(responseBody);
    case 400:
      throw new Error("Validation error occurred");
    case 401:
      throw new Error("Unauthorized");
    case 404:
      return null;
    case 500:
      throw new Error("Internal Server Error");
    default:
      throw new Error(
        "An error occurred retrieving product's next week availability"
      );
  }
}

export async function updateProductAvailability(
  productAvailabilityID,
  quantity
) {
  var obj = {
    quantity: parseInt(quantity),
  };

  const response = await fetch(`/api/availabilities/${productAvailabilityID}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...obj }),
  });

  switch (response.status) {
    case 204:
      return;
    case 400:
      throw new Error("Validation error occurred");
    case 401:
      throw new Error("Unauthorized");
    case 404:
      throw new Error("Not Found");
    case 500:
      throw new Error("Internal Server Error");
    default:
      throw new Error("An error occurred updating product availability");
  }
}

export async function confirmProductAvailability(productAvailabilityID) {
  const response = await fetch(
    `/api/availabilities/${productAvailabilityID}/confirm`,
    {
      method: "PATCH",
    }
  );

  switch (response.status) {
    case 204:
      return;
    case 400:
      throw new Error("Validation error occurred");
    case 401:
      throw new Error("Unauthorized");
    case 404:
      throw new Error("Not Found");
    case 500:
      throw new Error("Internal Server Error");
    default:
      throw new Error("An error occurred confirming product availability");
  }
}

export async function getProductByID(productID) {
  let response = await fetch("/api/products/" + productID);

  switch (response.status) {
    case 200:
      let responseBody = await response.json();
      return Product.fromJSON(responseBody);
    case 400:
      throw new Error("Validation error occurred");
    case 401:
      throw new Error("Unauthorized");
    case 404:
      throw new Error("Not Found");
    case 500:
      throw new Error("Internal Server Error");
    default:
      throw new Error("An error occurred retrieving the product");
  }
}

// -----
// Order
// -----

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

export async function updateStatus(status, orderID) {
  // again another mock function for frontend
  if (status === Order.OrderStatus.PREPARED) {
    const response = await fetch(`/api/orders/${orderID}/complete`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
    });

    switch (response.status) {
      case 204:
        return Order.OrderStatus.DONE;
      case 400:
        throw new Error(
          "Bad request: the request contained invalid parameter " + orderID
        );
      case 401:
        throw new Error("Unauthorized");
      case 500:
        throw new Error("Internal Server Error");
      default:
        throw new Error(
          "An error occurred during order update to complete status"
        );
    }
  }
}

export async function createOrder(clientID, products, shipmentInfo) {
  var obj = {
    clientID: clientID,
    products: products,
    shipmentInfo: shipmentInfo,
  };

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
    case 401:
      throw new Error(
        "Unauthorized - The user is not logged or is not allowed to make this action"
      );
    case 403:
      throw new Error(
        "Forbidden - The action cannot be executed in the current week phase"
      );
    default:
      throw new Error("An error occurred during order fetch");
  }
}

// ----------
// Weekphases
// ----------

export async function getCurrentWeekphase() {
  const response = await fetch("/api/weekphases/current");

  if (response.status !== 200) {
    throw new Error("An error occurred during current weekphase fetch");
  }
  let responseBody = await response.json();
  return responseBody;
}

export async function setWeekphaseOverride(weekphaseID) {
  const response = await fetch("/api/testing/weekphases/current", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ weekphaseID: weekphaseID }),
  });

  switch (response.status) {
    case 400:
      throw new Error("Validation error occurred");
    case 204:
      return;
    default:
      throw new Error("An error occurred during weekphase override");
  }
}

export async function setNextWeekphaseOverride() {
  const response = await fetch("/api/testing/weekphases/next", {
    method: "PATCH",
  });

  switch (response.status) {
    case 204:
      return;
    default:
      throw new Error("An error occurred during weekphase override");
  }
}

export async function setPreviousWeekphaseOverride() {
  const response = await fetch("/api/testing/weekphases/previous", {
    method: "PATCH",
  });

  switch (response.status) {
    case 204:
      return;
    default:
      throw new Error("An error occurred during weekphase override");
  }
}
