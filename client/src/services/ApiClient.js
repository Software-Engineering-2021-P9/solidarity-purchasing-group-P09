import Employee from "./models/Employee";
import ClientInfo from "./models/ClientInfo";

// --------
// Employee
// --------

export async function getEmployeeByID(employeeID) {
  const response = await fetch("/api/employees/" + employeeID);

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
  const response = await fetch("/api/clients");
  if (searchString) response += `?searchString=${searchString}`;

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
  const response = await fetch("/api/clients/" + clientID);

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
    method: "POST",
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
