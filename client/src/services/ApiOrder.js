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
