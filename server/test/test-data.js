const { ObjectID } = require("bson");
const dayjs = require("dayjs");
const { getNextWeek } = require("../utils/time");

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
      clientId: "6187c957b288576ca26f8257",
      products: [
        { productId: "6187c957b288576ca26f8258", quantity: 3 },
        { productId: "6187c957b288576ca26f8259", quantity: 1 },
        { productId: "6187c957b288576ca26f8250", quantity: 2 },
      ],
    },
  ],
};


exports.clientsCollection = {
  clients: [
    {
      _id: ObjectID("6187c957b288576ca26f8257"),
      email: "client1@test.com",
      fullName: " Domenico Bini",
      phoneNumber: 3205708803,
      address: "via Domenico Bini,26 Torino,10538",
      wallet: 55.50
    },
    {
      _id: ObjectID("6a8fc927bb88c762a26f0000"),
      email: "client2@test.com",
      fullName: "Andrea Diprè",
      phoneNumber: 3205755555,
      address: "via Andrea Dipre,24 Torino,10538",
      wallet: 0
    }
  ]
}

exports.productsCollection = {
  products: [
    {
      _id: ObjectID("000000000000000000000001"),
      farmerID: ObjectID("67696f76616a6a6a31a23334"),
      name: "Banana",
      description: "Origin: Italy",
      category: "fruit",
    },
    {
      _id: ObjectID("000000000000000000000002"),
      farmerID: ObjectID("67696f76616a6a6a31a23334"),
      name: "Zucchini",
      description: "Origin: Italy",
      category: "vegetables",
    },
    {
      _id: ObjectID("000000000000000000000003"),
      farmerID: ObjectID("67696f76616a6a6a31a23334"),
      name: "Ham",
      description: "Origin: Italy",
      category: "meat",
    },
    {
      _id: ObjectID("000000000000000000000004"),
      farmerID: ObjectID("67696f76616a6a6a31a23334"),
      name: "Egg",
      description: "Origin: Italy",
      category: "eggs",
    },
    {
      _id: ObjectID("000000000000000000000005"),
      farmerID: ObjectID("67696f76616a6a6a31a23334"),
      name: "Almond Milk",
      description: "Origin: Italy",
      category: "milk",
    },
    {
      _id: ObjectID("000000000000000000000006"),
      farmerID: ObjectID("67696f76616a6a6a31a23334"),
      name: "Nutella",
      description: "Origin: Italy",
      category: "spreadable creams",
    },
    {
      _id: ObjectID("000000000000000000000007"),
      farmerID: ObjectID("4c7564443132333435363738"),
      name: "Banana",
      description: "Origin: France",
      category: "fruit",
    },
    {
      _id: ObjectID("000000000000000000000008"),
      farmerID: ObjectID("4c7564443132333435363738"),
      name: "Zucchini",
      description: "Origin: France",
      category: "vegetables",
    },
    {
      _id: ObjectID("000000000000000000000009"),
      farmerID: ObjectID("4c7564443132333435363738"),
      name: "Ham",
      description: "Origin: France",
      category: "meat",
    },
    {
      _id: ObjectID("000000000000000000000010"),
      farmerID: ObjectID("4c7564443132333435363738"),
      name: "Egg",
      description: "Origin: France",
      category: "eggs",
    },
    {
      _id: ObjectID("000000000000000000000011"),
      farmerID: ObjectID("4c7564443132333435363738"),
      name: "Almond Milk",
      description: "Origin: France",
      category: "milk",
    },
    {
      _id: ObjectID("000000000000000000000012"),
      farmerID: ObjectID("4c7564443132333435363738"),
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
      farmerID: ObjectID("67696f76616a6a6a31a23334"),
      name: "Banana",
      description: "Origin: Italy",
      category: "Wrong Category",
    },
    {
      _id: ObjectID("000000000000000000000002"),
      farmerID: ObjectID("67696f76616a6a6a31a23334"),
      name: "Zucchini",
      description: "Origin: Italy",
      category: "vegetables",
    },
    {
      _id: ObjectID("000000000000000000000003"),
      farmerID: ObjectID("67696f76616a6a6a31a23334"),
      name: "Ham",
      description: "Origin: Italy",
      category: "meat",
    },
    {
      _id: ObjectID("000000000000000000000004"),
      farmerID: ObjectID("67696f76616a6a6a31a23334"),
      name: "Egg",
      description: "Origin: Italy",
      category: "eggs",
    },
    {
      _id: ObjectID("000000000000000000000005"),
      farmerID: ObjectID("67696f76616a6a6a31a23334"),
      name: "Almond Milk",
      description: "Origin: Italy",
      category: "milk",
    },
    {
      _id: ObjectID("000000000000000000000006"),
      farmerID: ObjectID("67696f76616a6a6a31a23334"),
      name: "Nutella",
      description: "Origin: Italy",
      category: "spreadable creams",
    },
    {
      _id: ObjectID("000000000000000000000007"),
      farmerID: ObjectID("4c7564443132333435363738"),
      name: "Banana",
      description: "Origin: France",
      category: "fruit",
    },
    {
      _id: ObjectID("000000000000000000000008"),
      farmerID: ObjectID("4c7564443132333435363738"),
      name: "Zucchini",
      description: "Origin: France",
      category: "vegetables",
    },
    {
      _id: ObjectID("000000000000000000000009"),
      farmerID: ObjectID("4c7564443132333435363738"),
      name: "Ham",
      description: "Origin: France",
      category: "meat",
    },
    {
      _id: ObjectID("000000000000000000000010"),
      farmerID: ObjectID("4c7564443132333435363738"),
      name: "Egg",
      description: "Origin: France",
      category: "eggs",
    },
    {
      _id: ObjectID("000000000000000000000011"),
      farmerID: ObjectID("4c7564443132333435363738"),
      name: "Almond Milk",
      description: "Origin: France",
      category: "milk",
    },
    {
      _id: ObjectID("000000000000000000000012"),
      farmerID: ObjectID("4c7564443132333435363738"),
      name: "Nutella",
      description: "Origin: France",
      category: "spreadable creams",
    },
  ],
};


const [nextWeek, currentYear] = getNextWeek(dayjs());

exports.productsAvailabilityCollection = {
  productsAvailability: [
    {
      _id: ObjectID("000000000000000000000001"),
      farmerID: ObjectID("67696f76616a6a6a31a23334"),
      productID: ObjectID("000000000000000000000001"),
      week: nextWeek,
      year: currentYear,
      price: 3.5,
      packaging: "100g",
      quantity: 5
    },
    {
      _id: ObjectID("000000000000000000000002"),
      farmerID: ObjectID("4c7564443132333435363738"),
      productID: ObjectID("000000000000000000000010"),
      week: 15,
      year: 2020,
      price: 2.3,
      packaging: "4 units",
      quantity: 25
    },
    {
      _id: ObjectID("000000000000000000000003"),
      farmerID: ObjectID("67696f76616a6a6a31a23334"),
      productID: ObjectID("000000000000000000000004"),
      week: nextWeek,
      year: currentYear,
      price: 2.3,
      packaging: "4 units",
      quantity: 25
    },
    {
      _id: ObjectID("000000000000000000000004"),
      farmerID: ObjectID("67696f76616a6a6a31a23334"),
      productID: ObjectID("000000000000000000000006"),
      week: nextWeek,
      year: currentYear,
      price: 4.50,
      packaging: "1 units",
      quantity: 27
    },
    {
      _id: ObjectID("000000000000000000000005"),
      farmerID: ObjectID("4c7564443132333435363738"),
      productID: ObjectID("000000000000000000000012"),
      week: nextWeek,
      year: currentYear,
      price: 6,
      packaging: "1 units",
      quantity: 30
    },
    {
      _id: ObjectID("000000000000000000000005"),
      farmerID: ObjectID("4c7564443132333435363738"),
      productID: ObjectID("000000000000000000000012"),
      week: 1,
      year: 2021,
      price: 6,
      packaging: "1 units",
      quantity: 90
    }
  ]
};

