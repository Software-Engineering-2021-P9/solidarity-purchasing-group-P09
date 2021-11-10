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

exports.ordersCollection = {
  orders: [
    {
      _id: ObjectID("6187c957b288576ca26f8251"),
      clientId: 12321321421421,
      products: [
        { name: "apple", quantity: 3 },
        { name: "banana", quantity: 1 },
        { name: "tomatoes", quantity: 2 },
      ],
    },
  ],
};
