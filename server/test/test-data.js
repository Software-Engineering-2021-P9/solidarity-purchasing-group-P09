const { ObjectID } = require("bson");

exports.employeesCollection = {
  employees: [
    {
      _id: ObjectID("6187c957b288576ca26f8257"),
      email: "employee1@test.com",
      password: "password",
      fullName: "Mario Biondi",
    },
    {
      _id: ObjectID("6187c957b288576ca26f8259"),
      email: "employee2@test.com",
      password: "password",
      fullName: "Mario Rossi",
    },
  ],
};
