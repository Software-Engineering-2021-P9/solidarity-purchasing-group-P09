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
      clientID: ObjectID("6187c957b288576ca26f8257"),
      products: [
        { productID: "6187c957b288576ca26f8258", quantity: 3 },
        { productID: "6187c957b288576ca26f8259", quantity: 1 },
        { productID: "6187c957b288576ca26f8250", quantity: 2 },
      ],
      status: "waiting",
      totalPrice: "6",
      createdAt: "2021-11-16T13:00:07.616Z",
    },
    {
      _id: ObjectID("6187c957b288576ca26f8999"),
      clientID: ObjectID("6187c957b288576ca26f8257"),
      products: [
        { productID: "6187c957b288576ca26f8258", quantity: 10 },
        { productID: "6187c957b288576ca26f8259", quantity: 2 },
      ],
      status: "done",
      totalPrice: "12",
      createdAt: "2021-12-16T13:00:07.616Z",
    },
  ],
};

exports.clientsCollection = {
  clients: [
    {
      _id: ObjectID("618d4ad3736f2caf2d3b3ca5"),
      email: "ehsanansari@gmail.com",
      password: "123456789",
      fullName: "Ehsan",
      phoneNumber: 3205755555,
      address: "via Andrea Dipre,24 Torino,10538",
      wallet: 0,
    },
    {
      _id: ObjectID("6187c957b288576ca26f8257"),
      email: "client1@test.com",
      fullName: " Domenico Bini",
      phoneNumber: 3205708803,
      address: "via Domenico Bini,26 Torino,10538",
      wallet: 55.5,
    },
    {
      _id: ObjectID("6a8fc927bb88c762a26f0000"),
      email: "client2@test.com",
      fullName: "Andrea Diprè",
      phoneNumber: 3205755555,
      address: "via Andrea Dipre,24 Torino,10538",
      wallet: 0,
    },
  ],
};

exports.productsCollection = {
  products: [
    {
      _id: ObjectID("000000000000000000000001"),
      farmerID: ObjectID("giovanni1234"),
      name: "Banana",
      description: "Origin: Italy",
      category: "fruit",
    },
    {
      _id: ObjectID("000000000000000000000002"),
      farmerID: ObjectID("giovanni1234"),
      name: "Zucchini",
      description: "Origin: Italy",
      category: "vegetables",
    },
    {
      _id: ObjectID("000000000000000000000003"),
      farmerID: ObjectID("giovanni1234"),
      name: "Ham",
      description: "Origin: Italy",
      category: "meat",
    },
    {
      _id: ObjectID("000000000000000000000004"),
      farmerID: ObjectID("giovanni1234"),
      name: "Egg",
      description: "Origin: Italy",
      category: "eggs",
    },
    {
      _id: ObjectID("000000000000000000000005"),
      farmerID: ObjectID("giovanni1234"),
      name: "Almond Milk",
      description: "Origin: Italy",
      category: "milk",
    },
    {
      _id: ObjectID("000000000000000000000006"),
      farmerID: ObjectID("giovanni1234"),
      name: "Nutella",
      description: "Origin: Italy",
      category: "spreadable creams",
    },
    {
      _id: ObjectID("000000000000000000000007"),
      farmerID: ObjectID("Luca12345678"),
      name: "Banana",
      description: "Origin: France",
      category: "fruit",
    },
    {
      _id: ObjectID("000000000000000000000008"),
      farmerID: ObjectID("Luca12345678"),
      name: "Zucchini",
      description: "Origin: France",
      category: "vegetables",
    },
    {
      _id: ObjectID("000000000000000000000009"),
      farmerID: ObjectID("Luca12345678"),
      name: "Ham",
      description: "Origin: France",
      category: "meat",
    },
    {
      _id: ObjectID("000000000000000000000010"),
      farmerID: ObjectID("Luca12345678"),
      name: "Egg",
      description: "Origin: France",
      category: "eggs",
    },
    {
      _id: ObjectID("000000000000000000000011"),
      farmerID: ObjectID("Luca12345678"),
      name: "Almond Milk",
      description: "Origin: France",
      category: "milk",
    },
    {
      _id: ObjectID("000000000000000000000012"),
      farmerID: ObjectID("Luca12345678"),
      name: "Nutella",
      description: "Origin: France",
      category: "spreadable creams",
    },
  ],
};

exports.productsCollectionWithCategoryError = {
  products: [
    {
      _id: ObjectID("000000000000000000000001"),
      farmerID: ObjectID("giovanni1234"),
      name: "Banana",
      description: "Origin: Italy",
      category: "Wrong Category",
    },
    {
      _id: ObjectID("000000000000000000000002"),
      farmerID: ObjectID("giovanni1234"),
      name: "Zucchini",
      description: "Origin: Italy",
      category: "vegetables",
    },
    {
      _id: ObjectID("000000000000000000000003"),
      farmerID: ObjectID("giovanni1234"),
      name: "Ham",
      description: "Origin: Italy",
      category: "meat",
    },
    {
      _id: ObjectID("000000000000000000000004"),
      farmerID: ObjectID("giovanni1234"),
      name: "Egg",
      description: "Origin: Italy",
      category: "eggs",
    },
    {
      _id: ObjectID("000000000000000000000005"),
      farmerID: ObjectID("giovanni1234"),
      name: "Almond Milk",
      description: "Origin: Italy",
      category: "milk",
    },
    {
      _id: ObjectID("000000000000000000000006"),
      farmerID: ObjectID("giovanni1234"),
      name: "Nutella",
      description: "Origin: Italy",
      category: "spreadable creams",
    },
    {
      _id: ObjectID("000000000000000000000007"),
      farmerID: ObjectID("Luca12345678"),
      name: "Banana",
      description: "Origin: France",
      category: "fruit",
    },
    {
      _id: ObjectID("000000000000000000000008"),
      farmerID: ObjectID("Luca12345678"),
      name: "Zucchini",
      description: "Origin: France",
      category: "vegetables",
    },
    {
      _id: ObjectID("000000000000000000000009"),
      farmerID: ObjectID("Luca12345678"),
      name: "Ham",
      description: "Origin: France",
      category: "meat",
    },
    {
      _id: ObjectID("000000000000000000000010"),
      farmerID: ObjectID("Luca12345678"),
      name: "Egg",
      description: "Origin: France",
      category: "eggs",
    },
    {
      _id: ObjectID("000000000000000000000011"),
      farmerID: ObjectID("Luca12345678"),
      name: "Almond Milk",
      description: "Origin: France",
      category: "milk",
    },
    {
      _id: ObjectID("000000000000000000000012"),
      farmerID: ObjectID("Luca12345678"),
      name: "Nutella",
      description: "Origin: France",
      category: "spreadable creams",
    },
  ],
};
