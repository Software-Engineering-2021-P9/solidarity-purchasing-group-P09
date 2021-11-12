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
        { productId: "a123dasvfdacasds", quantity: 3 },
        { productId: "b123dasvfdacasds", quantity: 1 },
        { productId: "c123dasvfdacasds", quantity: 2 },
      ],
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
