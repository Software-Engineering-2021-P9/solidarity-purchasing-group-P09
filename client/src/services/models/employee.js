class Employee {
  constructor(id, email, password, fullName) {
    this.id = id;
    this.email = email;
    this.password = password;
    this.fullName = fullName;
  }

  static fromJSON(json) {
    return new Employee(json.id, json.email, json.password, json.fullName);
  }
}

export default Employee;
