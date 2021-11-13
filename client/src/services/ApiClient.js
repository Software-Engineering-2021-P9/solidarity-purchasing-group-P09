import Employee from "./models/Employee";

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

export async function createOrder(clientId, products) {
  var obj = { clientId: clientId, products: products };
  console.log(obj);

  await fetch("/api/orders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...obj }),
  });
}
