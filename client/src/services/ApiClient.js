import Employee from "./models/Employee";
import ClientInfo from "./models/ClientInfo";
import Product from "./models/Product";
import Order from "./models/Order";
import ProductAvailability from "./models/ProductAvailability";

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
      return Employee.fromJSON(responseBody);
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
      return responseBody.map((clientJson) => ClientInfo.fromJSON(clientJson));
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
      return ClientInfo.fromJSON(responseBody);
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

export async function getFarmerProducts(
  farmerID,
  category = null,
  searchString = null,
  isAvailable = null
) {
  var queryParams = {};
  if (category) queryParams["category"] = category;
  if (searchString) queryParams["searchString"] = searchString;
  if (isAvailable) queryParams["isAvailable"] = isAvailable;

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

export async function getProductByID(productID) {
  let response = await fetch(`/api/products/${productID}`);

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
      throw new Error("An error occurred during product retrieval");
  }
}

export async function setNextWeekProductAvailability(
  productID,
  price,
  packaging,
  quantity
) {
  var obj = {
    price: price,
    packaging: packaging,
    quantity: quantity,
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
        "An error occurred setting products' next week availability"
      );
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
  console.log(productIDs);
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
