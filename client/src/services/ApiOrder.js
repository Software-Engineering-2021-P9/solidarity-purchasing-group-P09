import Order from "./models/Order";

// --------
// Order
// --------

export async function createOrder(clientId, products) {
  var obj = { clientId: clientId, products: products };
  console.log(obj);

  const response = await fetch("/api/orders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...obj }),
  });
}
