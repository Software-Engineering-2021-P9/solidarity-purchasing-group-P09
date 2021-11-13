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

exports.clientsCollection = {
  clients: [
    {
      _id: ObjectID("6187c957b288576ca26f8257"),
      email: "client1@test.com",
      password: "sosuonareeh?",
      fullName: " Domenico Bini",
      phoneNumber: 3205708803,
      address: "via DomenicoBini,26 Torino,10538",
      wallet: 55.50
    },
    {
      _id: ObjectID("6a8fc927bb88c762a26f0000"),
      email: "client2@test.com",
      password: "sonouncriticoeh?",
      fullName: "Andrea Diprè",
      phoneNumber: 3205755555,
      address: "via AndreaDipre,24 Torino,10538",
      wallet: 0
    }
  ]
}
