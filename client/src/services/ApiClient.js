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

//CreatClient
async function addClient(client) {
 
  const response = await fetch(url + "/api/clients", {
    method : 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({...client, fullName: client.firstname +" "+ client.lastname,
     address: client.address +", "+ client.number+" "+ client.city+ ", "+client.postCode})
  });
  console.log("here");

  if(response.OK)
  return null;
  else return {'err': 'POST error'};
}

const API = {addClient};
export default API;