const { ObjectID } = require("bson");
const dayjs = require("dayjs");

const { getNextWeek, getCurrentWeek } = require("../services/time_service");

exports.managersCollection = {
  managers: [
    {
      _id: ObjectID("1187c957b288576ca26f8257"),
      email: "manager1@test.com",
      password: "$2a$10$AU6PIEG1tq1467LUurqOjuoKzdvdtZHTFnCh00YzNGm7zzf7wa0rq",
      role: "manager",
      fullName: "Mario Biondi",
    },
  ],
};

exports.employeesCollection = {
  employees: [
    {
      _id: ObjectID("6187c957b288576ca26f8257"),
      email: "employee1@test.com",
      password: "$2a$10$AU6PIEG1tq1467LUurqOjuoKzdvdtZHTFnCh00YzNGm7zzf7wa0rq",
      role: "employee",
      fullName: "Mario Biondi",
    },
    {
      _id: ObjectID("6187c957b288576ca26f8259"),
      email: "employee2@test.com",
      password: "$2a$10$AU6PIEG1tq1467LUurqOjuoKzdvdtZHTFnCh00YzNGm7zzf7wa0rq",
      role: "employee",
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
      status: "prepared",
      totalPrice: "6",
      createdAt: "2021-11-16T13:00:07.616Z",
      shipmentInfo: {
        type: "pickup",
        pickUpSlot: "32200",
        address: "Via Prapappo Ravanello 54",
      },
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
      createdAt: "2021-12-17T13:00:07.616Z",
      shipmentInfo: {
        type: "pickup",
        pickUpSlot: "42200",
        address: "Via of the market ",
      },
    },
    {
      _id: ObjectID("6187c957b288576ca26f8990"),
      clientID: ObjectID("6187c957b288576ca26f8251"),
      products: [
        { productID: "6187c957b288576ca26f8258", quantity: 10 },
        { productID: "6187c957b288576ca26f8259", quantity: 2 },
      ],
      status: "waiting",
      totalPrice: "12",
      createdAt: "2021-12-16T13:00:07.616Z",
      shipmentInfo: {
        type: "shipment",
        address: "Via it's real trust me 54",
      },
    },
  ],
};

exports.ordersCollection2 = {
  orders: [
    {
      _id: ObjectID("6187c957b288576ca26f8251"),
      clientID: ObjectID("6187c957b288576ca26f8257"),
      products: [
        { productID: "6187c957b288576ca26f8258", quantity: 3 },
        { productID: "6187c957b288576ca26f8259", quantity: 1 },
        { productID: "6187c957b288576ca26f8250", quantity: 2 },
      ],
      status: "pending-cancelation",
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
      createdAt: "2021-12-17T13:00:07.616Z",
    },
    {
      _id: ObjectID("6187c957b288576ca26f8990"),
      clientID: ObjectID("6187c957b288576ca26f8257"),
      products: [
        { productID: "6187c957b288576ca26f8258", quantity: 10 },
        { productID: "6187c957b288576ca26f8259", quantity: 2 },
      ],
      status: "waiting",
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
      //role: "client",
      fullName: " Ehsan",
      phoneNumber: 3205758803,
      //password: "$2a$10$AU6PIEG1tq1467LUurqOjuoKzdvdtZHTFnCh00YzNGm7zzf7wa0rq",
      address: "fsfsaf dsafsa fsafsa,26 Milano,12342",
      wallet: 55.5,
    },
    {
      _id: ObjectID("6187c957b288576ca26f8257"),
      email: "client1@test.com",
      //role: "client",
      fullName: " Domenico Bini",
      phoneNumber: 3205708803,
      address: "via Domenico Bini,26 Torino,10538",
      wallet: 55.5,
    },
    {
      _id: ObjectID("6a8fc927bb88c762a26f0000"),
      email: "client2@test.com",
      //role: "client",
      fullName: "Andrea Diprè",
      phoneNumber: 3205755555,
      address: "via Andrea Dipre,24 Torino,10538",
      wallet: 0,
    },
  ],
};

exports.farmersCollection = {
  farmers: [
    {
      _id: ObjectID("6187c957b288576ca24f8257"),
      email: "farmer1@test.com",
      password: "$2a$10$AU6PIEG1tq1467LUurqOjuoKzdvdtZHTFnCh00YzNGm7zzf7wa0rq",
      role: "farmer",
      fullName: " Domenico Farmer",
      address: "via Domenico Bini,26 Torino,10538",
    },
  ],
};

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
      _id: ObjectID("111111111111111111111111"),
      farmerID: ObjectID("67696f76616a6a6a31a23334"),
      name: "Golden Delicious Apple",
      description: "Origin: Italy",
      category: "fruit",
    },
    {
      _id: ObjectID("222222222222222222222222"),
      farmerID: ObjectID("67696f76616a6a6a31a23334"),
      name: "Stark Delicious Apple",
      description: "Origin: Italy",
      category: "fruit",
    },
    {
      _id: ObjectID("333333333333333333333333"),
      farmerID: ObjectID("67696f76616a6a6a31a23334"),
      name: "Royal Gala Apple",
      description: "Origin: Italy",
      category: "fruit",
    },
    {
      _id: ObjectID("444444444444444444444444"),
      farmerID: ObjectID("67696f76616a6a6a31a23334"),
      name: "Pineapple",
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

let nextWeek;
let currentWeek;
let currentYear;
[nextWeek, currentYear] = getNextWeek(dayjs());
[currentWeek, currentYear] = getCurrentWeek(dayjs());

exports.productsAvailabilityCollection = {
  availabilities: [
    {
      _id: ObjectID("000000000000000000000001"),
      farmerID: ObjectID("67696f76616a6a6a31a23334"),
      productID: ObjectID("000000000000000000000001"),
      week: nextWeek,
      year: currentYear,
      price: 3.5,
      packaging: "100g",
      quantity: 5,
    },
    {
      _id: ObjectID("100000000000000000000001"),
      farmerID: ObjectID("67696f76616a6a6a31a23334"),
      productID: ObjectID("000000000000000000000001"),
      week: currentWeek,
      year: currentYear,
      price: 3.5,
      packaging: "100g",
      quantity: 5,
    },
    {
      _id: ObjectID("000000000000000000000002"),
      farmerID: ObjectID("4c7564443132333435363738"),
      productID: ObjectID("000000000000000000000011"),
      week: 15,
      year: 2020,
      price: 2.3,
      packaging: "4 units",
      quantity: 25,
    },
    {
      _id: ObjectID("000000000000000000000003"),
      farmerID: ObjectID("67696f76616a6a6a31a23334"),
      productID: ObjectID("000000000000000000000004"),
      week: nextWeek,
      year: currentYear,
      price: 2.3,
      packaging: "4 units",
      quantity: 25,
    },
    {
      _id: ObjectID("000000000000000000000004"),
      farmerID: ObjectID("67696f76616a6a6a31a23334"),
      productID: ObjectID("000000000000000000000006"),
      week: nextWeek,
      year: currentYear,
      price: 4.5,
      packaging: "1 units",
      quantity: 52,
    },
    {
      _id: ObjectID("000000000000000000000014"),
      farmerID: ObjectID("67696f76616a6a6a31a23334"),
      productID: ObjectID("000000000000000000000006"),
      week: currentWeek,
      year: currentYear,
      price: 4.5,
      packaging: "1 units",
      quantity: 27,
    },
    {
      _id: ObjectID("000000000000000000000005"),
      farmerID: ObjectID("4c7564443132333435363738"),
      productID: ObjectID("000000000000000000000012"),
      week: nextWeek,
      year: currentYear,
      price: 6,
      packaging: "1 units",
      quantity: 30,
    },
    {
      _id: ObjectID("000000000000000000000015"),
      farmerID: ObjectID("4c7564443132333435363738"),
      productID: ObjectID("000000000000000000000012"),
      week: currentWeek,
      year: currentYear,
      price: 6,
      packaging: "1 units",
      quantity: 30,
    },
    {
      _id: ObjectID("000000000000000000000006"),
      farmerID: ObjectID("4c7564443132333435363738"),
      productID: ObjectID("000000000000000000000012"),
      week: 1,
      year: 2021,
      price: 6,
      packaging: "1 units",
      quantity: 90,
    },
  ],
};

exports.productsAvailabilityCollection2 = {
  availabilities: [
    {
      _id: ObjectID("000000000000000000000001"),
      farmerID: ObjectID("67696f76616a6a6a31a23334"),
      productID: ObjectID("000000000000000000000001"),
      week: nextWeek,
      year: currentYear,
      price: 3.5,
      packaging: "100g",
      quantity: 5,
    },
    {
      _id: ObjectID("000000000000000000000002"),
      farmerID: ObjectID("4c7564443132333435363738"),
      productID: ObjectID("000000000000000000000010"),
      week: 15,
      year: 2020,
      price: 2.3,
      packaging: "4 units",
      quantity: 25,
    },
    {
      _id: ObjectID("000000000000000000000003"),
      farmerID: ObjectID("67696f76616a6a6a31a23334"),
      productID: ObjectID("000000000000000000000004"),
      week: nextWeek,
      year: currentYear,
      price: 2.3,
      packaging: "4 units",
      quantity: 25,
    },
    {
      _id: ObjectID("000000000000000000000004"),
      farmerID: ObjectID("67696f76616a6a6a31a23334"),
      productID: ObjectID("000000000000000000000006"),
      week: nextWeek,
      year: currentYear,
      price: 4.5,
      packaging: "1 units",
      quantity: 27,
    },
    {
      _id: ObjectID("000000000000000000000005"),
      farmerID: ObjectID("4c7564443132333435363738"),
      productID: ObjectID("000000000000000000000012"),
      week: nextWeek,
      year: currentYear,
      price: 6,
      packaging: "1 units",
      quantity: 30,
    },
    {
      _id: ObjectID("000000000000000000000006"),
      farmerID: ObjectID("67696f76616a6a6a31a23334"),
      productID: ObjectID("111111111111111111111111"),
      week: nextWeek,
      year: currentYear,
      price: 3.5,
      packaging: "6 units",
      quantity: 90,
    },
    {
      _id: ObjectID("000000000000000000000007"),
      farmerID: ObjectID("67696f76616a6a6a31a23334"),
      productID: ObjectID("222222222222222222222222"),
      week: nextWeek,
      year: currentYear,
      price: 2,
      packaging: "3 units",
      quantity: 30,
    },
    {
      _id: ObjectID("000000000000000000000008"),
      farmerID: ObjectID("67696f76616a6a6a31a23334"),
      productID: ObjectID("333333333333333333333333"),
      week: 12,
      year: 2020,
      price: 6,
      packaging: "6 units",
      quantity: 99,
    },
    {
      _id: ObjectID("000000000000000000000009"),
      farmerID: ObjectID("67696f76616a6a6a31a23334"),
      productID: ObjectID("444444444444444444444444"),
      week: nextWeek,
      year: currentYear,
      price: 4.5,
      packaging: "1 units",
      quantity: 33,
    },
  ],
};

exports.userTelegramCollection = {
  chats: [
    {
      _id: ObjectID("6187c957b288576ca26f8257"),
      chatID: 371107506,
    },
    {
      _id: ObjectID("6187c957b288576ca26f8252"),
      chatID: 1322211351,
    },
  ],
};
