"use strict"

import {Employee} from "models/employee";

// --------
// Employee
// --------


export async function getEmployeeByID(employeeID) {
    const response = await fetch("/api/employee/"+employeeID);
  
  
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