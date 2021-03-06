const chai = require("chai");
const expect = chai.expect;
const chaiHttp = require("chai-http");
chai.use(chaiHttp);
const mongoUnit = require("mongo-unit");

const testData = require("./test-data");

const {
  getCurrentWeekClient,
} = require("../services/weekphase_service/weekphase_service");
let dao = require("../dao/dao");

// ----------------------------------
// FAKE DATABASE AND TEST SERVER INIT
// ----------------------------------
// This will contain the main server app, needed to listen for requests.
// This is initialized when the mock MongoDB initialization is completed.
let app;

const mongoTestDBName = "spg-test";

before(async () => {
  // Init mock MongoDB
  let dbURL = await mongoUnit.start({ dbName: mongoTestDBName });
  process.env.MONGO_CONN_STR = dbURL;
  process.env.MONGO_DB_NAME = mongoTestDBName;
  app = require("../app");

  // Import test files
  require("./test_weekphase").tests(app, mongoUnit, testData, dao);
});

after(() => {
  return mongoUnit.stop();
});

// -----
// TESTS
// -----

// Employees API tests
describe("Employees API tests:", () => {
  beforeEach(() => {
    dao.open();
    mongoUnit.load(testData.employeesCollection);
  });

  afterEach(() => {
    mongoUnit.drop();
    dao.close();
  });

  describe("GET /employees/:employeeID", () => {
    it("it should retrieve the employee associated to the given ID", (done) => {
      chai
        .request(app)
        .get("/api/employees/6187c957b288576ca26f8257")
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res.status).to.be.equal(200);
          expect(res.body).to.be.an("object");
          expect(res.body.fullName).to.be.equal("Mario Biondi");
          done();
        });
    });

    it("it should fail when the employee associated to the given ID doesn't exist", (done) => {
      chai
        .request(app)
        .get("/api/employees/6187c957b288076ca26f8234")
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res.status).to.be.equal(404);
          done();
        });
    });

    it("it must fail when an invalid Mongo ID is passed", (done) => {
      chai
        .request(app)
        .get("/api/employees/test")
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res.status).to.be.equal(400);

          done();
        });
    });

    it("it must fail when mongo fails", (done) => {
      dao.close();
      chai
        .request(app)
        .get("/api/employees/6187c957b288576ca26f8257")
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res.status).to.be.equal(500);

          done();
        });
    });
  });

  describe("POST /employees", () => {
    it("it should create a new employee", (done) => {
      chai
        .request(app)
        .post("/api/employees")
        .send({
          email: "employee3@test.com",
          password: "password",
          fullName: "Mario Verdi",
        })
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res.status).to.be.equal(200);
          expect(res.body).to.be.an("object");
          expect(res.body.email).to.be.equal("employee3@test.com");
          expect(res.body.fullName).to.be.equal("Mario Verdi");

          done();
        });
    });

    it("it must fail when an invalid email is passed", (done) => {
      chai
        .request(app)
        .post("/api/employees")
        .send({
          email: "notanemail",
          password: "password",
          fullName: "Mario Verdi",
        })
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res.status).to.be.equal(400);

          done();
        });
    });

    it("it must fail when a password too short is passed", (done) => {
      chai
        .request(app)
        .post("/api/employees")
        .send({
          email: "employee3@test.com",
          password: "pas",
          fullName: "Mario Verdi",
        })
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res.status).to.be.equal(400);

          done();
        });
    });

    it("it must fail when a fullName too long is passed", (done) => {
      chai
        .request(app)
        .post("/api/employees")
        .send({
          email: "employee3@test.com",
          password: "password",
          fullName: "Mario VerdiMario VerdiMario VerdiMario VerdiMario Verdi",
        })
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res.status).to.be.equal(400);

          done();
        });
    });

    it("it must fail when mongo fails", (done) => {
      dao.close();
      chai
        .request(app)
        .post("/api/employees")
        .send({
          email: "employee3@test.com",
          password: "password",
          fullName: "Mario Verdi",
        })
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res.status).to.be.equal(500);

          done();
        });
    });
  });
});

//Product API tests
describe("Products API tests: ", () => {
  beforeEach(() => {
    dao.open();
    mongoUnit.load(testData.productsCollection);
    mongoUnit.load(testData.productsAvailabilityCollection);
    dao.createProductsTextSearchIndexes();
  });

  afterEach(() => {
    mongoUnit.drop();
    dao.close();
  });

  describe("GET /products", () => {
    it("it should retrieve the list of all (available and not available) products based on the filters sent: ids", (done) => {
      chai
        .request(app)
        .get(
          "/api/products?ids=000000000000000000000001,000000000000000000000003,000000000000000000000008"
        )
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res.status).to.be.equal(200);
          expect(res.body).to.be.an("array");
          expect(res.body.length).to.be.equal(3);
          expect(res.body.map((product) => product.id)).to.include.members([
            "000000000000000000000001",
            "000000000000000000000003",
            "000000000000000000000008",
          ]);
          done();
        });
    });

    it("It should return an error if the ids passed are not valid: ", (done) => {
      chai
        .request(app)
        .get(
          "/api/products?ids=000000000000000000000001,000000000000000000000003,08"
        )
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res.status).to.be.equal(400);
          done();
        });
    });

    it("It should return an error while reading on the db if it has a wrong category: ", (done) => {
      //upload new data set:
      mongoUnit.drop();
      dao.close();

      dao.open();
      mongoUnit.load(testData.productsCollectionWithCategoryError);
      dao.createProductsTextSearchIndexes();
      chai
        .request(app)
        .get(
          "/api/products?ids=000000000000000000000001,000000000000000000000002"
        )
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res.status).to.be.equal(500);
          done();
        });
    });

    it("It should return the product 000000000000000000000012 with availability set: ", (done) => {
      chai
        .request(app)
        .get("/api/products/000000000000000000000012")
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res.status).to.be.equal(200);
          expect(res.body.id).to.be.equal("000000000000000000000012");
          expect(res.body.availability).to.be.not.null;
          expect(res.body.availability.price).to.be.equal(6);
          expect(res.body.availability.quantity).to.be.equal(30);
          done();
        });
    });

    it("It should return the product 000000000000000000000010 without availability set: ", (done) => {
      chai
        .request(app)
        .get("/api/products/000000000000000000000010")
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res.status).to.be.equal(200);
          expect(res.body.id).to.be.equal("000000000000000000000010");
          expect(res.body.availability).to.be.null;
          done();
        });
    });

    it("it should return 404 not found given a non existing ID", (done) => {
      chai
        .request(app)
        .get("/api/products/00000ab00000000000000010")
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res.status).to.be.equal(404);
          done();
        });
    });

    it("it must fail when mongo fails", (done) => {
      dao.close();
      chai
        .request(app)
        .get("/api/products/000000000000000000000010")
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res.status).to.be.equal(500);
          done();
        });
    });

    it("it must fail when a wrong productID is given", (done) => {
      chai
        .request(app)
        .get("/api/products/aaaa")
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res.status).to.be.equal(400);
          done();
        });
    });

    it("it must return 404 not found when a non existing productID is given", (done) => {
      chai
        .request(app)
        .get("/api/products/00000000000a00b000c00010")
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res.status).to.be.equal(404);
          done();
        });
    });

    it("it must return the newly created product availability", (done) => {
      chai
        .request(app)
        .post("/api/products/000000000000000000000010/availability")
        .send({
          price: 2.5,
          packaging: "6 units",
          quantity: 55,
        })
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res.status).to.be.equal(200);
          expect(res.body.price).to.be.equal(2.5);
          expect(res.body.packaging).to.be.equal("6 units");
          expect(res.body.quantity).to.be.equal(55);
          expect(res.body.farmerID).to.be.equal("4c7564443132333435363738");
          expect(res.body.productID).to.be.equal("000000000000000000000010");
          done();
        });
    });

    it("it must return bad request if the product doesn't exist", (done) => {
      chai
        .request(app)
        .post("/api/products/000000000000aaa000000010/availability")
        .send({
          price: 2.5,
          packaging: "6 units",
          quantity: 55,
        })
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res.status).to.be.equal(400);
          done();
        });
    });

    it("it must return bad request if the product availability for next week is already set", (done) => {
      chai
        .request(app)
        .post("/api/products/000000000000000000000012/availability")
        .send({
          price: 2.5,
          packaging: "6 units",
          quantity: 55,
        })
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res.status).to.be.equal(400);
          done();
        });
    });

    it("it must fail when mongo fails", (done) => {
      dao.close();
      chai
        .request(app)
        .post("/api/products/000000000000000000000012/availability")
        .send({
          price: 2.5,
          packaging: "6 units",
          quantity: 55,
        })
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res.status).to.be.equal(500);
          done();
        });
    });

    it("it must return bad request if the price is less then 0.01", (done) => {
      chai
        .request(app)
        .post("/api/products/000000000000000000000010/availability")
        .send({
          price: 0,
          packaging: "6 units",
          quantity: 55,
        })
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res.status).to.be.equal(400);
          done();
        });
    });

    it("it must return bad request if the quantity is less then 1", (done) => {
      chai
        .request(app)
        .post("/api/products/000000000000000000000010/availability")
        .send({
          price: 2.4,
          packaging: "6 units",
          quantity: 0,
        })
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res.status).to.be.equal(400);
          done();
        });
    });

    it("it must return bad request if the productID is not a mongoID", (done) => {
      chai
        .request(app)
        .post("/api/products/aaaa/availability")
        .send({
          price: 2.4,
          packaging: "6 units",
          quantity: 0,
        })
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res.status).to.be.equal(400);
          done();
        });
    });

    it("it must return the next week availability of the product ", (done) => {
      chai
        .request(app)
        .get("/api/products/000000000000000000000006/availability/nextWeek")
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res.status).to.be.equal(200);
          expect(res.body.productID).to.be.equal("000000000000000000000006");
          expect(res.body.quantity).to.be.equal(52);
          done();
        });
    });

    it("it must return bad request if the productID is not a mongoID", (done) => {
      chai
        .request(app)
        .get("/api/products/000000000111100000006/availability/nextWeek")
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res.status).to.be.equal(400);
          done();
        });
    });

    it("it must return not found if the product hasn't nextweek availability set", (done) => {
      chai
        .request(app)
        .get("/api/products/000000000000000000000011/availability/nextWeek")
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res.status).to.be.equal(404);
          done();
        });
    });

    it("it must return the current week availability of the product ", (done) => {
      chai
        .request(app)
        .get("/api/products/000000000000000000000006/availability/currentWeek")
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res.status).to.be.equal(200);
          expect(res.body.productID).to.be.equal("000000000000000000000006");
          expect(res.body.quantity).to.be.equal(52);
          done();
        });
    });

    it("it must return bad request if the productID is not a mongoID", (done) => {
      chai
        .request(app)
        .get("/api/products/000000000111100000006/availability/currentWeek")
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res.status).to.be.equal(400);
          done();
        });
    });

    it("it must return not found if the product hasn't current week availability set", (done) => {
      chai
        .request(app)
        .get("/api/products/000000000000000000000011/availability/currentWeek")
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res.status).to.be.equal(404);
          done();
        });
    });
  });

  describe("GET /products/available", () => {
    it("it should retrieve the list of available products based on the filters sent: CATEGORY", (done) => {
      chai
        .request(app)
        .get("/api/products/available?category=spreadable creams")
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res.status).to.be.equal(200);
          expect(res.body).to.be.an("array");
          expect(res.body.length).to.be.equal(2);
          expect(
            res.body.map((product) => product.availability.productID)
          ).to.be.eql(["000000000000000000000006", "000000000000000000000012"]);
          done();
        });
    });

    it("it should retrieve the list of available products based on the filters sent: SEARCHSTRING", (done) => {
      chai
        .request(app)
        .get("/api/products/available?searchString=Nutella")
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res.status).to.be.equal(200);
          expect(res.body).to.be.an("array");
          expect(res.body.length).to.be.equal(2);
          expect(res.body.map((product) => product.id)).to.include.members([
            "000000000000000000000012",
            "000000000000000000000006",
          ]);
          done();
        });
    });

    it("it should retrieve the list of available products based on the filters sent: CATEGORY, SEARCHSTRING", (done) => {
      chai
        .request(app)
        .get("/api/products/available?category=fruit&searchString=Italy")
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res.status).to.be.equal(200);
          expect(res.body).to.be.an("array");
          expect(res.body.length).to.be.equal(1);
          expect(res.body.map((product) => product.id)).to.include.members([
            "000000000000000000000001",
          ]);
          done();
        });
    });

    it("If no filter are passed then all the available products should be retrieved", (done) => {
      chai
        .request(app)
        .get("/api/products/available")
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res.status).to.be.equal(200);
          expect(res.body).to.be.an("array");
          expect(res.body.length).to.be.equal(4);
          done();
        });
    });

    it("If there are no available products with applied filters then it should return an empty array", (done) => {
      chai
        .request(app)
        .get("/api/products/available?category=meat&searchString=Do not find")
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res.status).to.be.equal(200);
          expect(res.body).to.be.an("array");
          expect(res.body.length).to.be.equal(0);
          done();
        });
    });

    it("It should return an error if the category passed is not valid: ", (done) => {
      chai
        .request(app)
        .get("/api/products/available?category=pizza")
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res.status).to.be.equal(400);
          done();
        });
    });
  });

  describe("POST / products", () => {
    it("it should return the new product just written on the DB", (done) => {
      chai
        .request(app)
        .post("/api/products")
        .send({
          farmerID: "6187c957b288576ca24f8257",
          name: "TestProduct",
          description: "This is a test product",
          category: "fruit",
        })
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res.status).to.be.equal(200);
          expect(res.body.id).to.be.an("string");
          expect(res.body.id).to.be.not.null;

          // get the order with newly retrived ID to check if everything is ok
          chai
            .request(app)
            .get("/api/products/" + res.body.id)
            .end((err, res) => {
              expect(err).to.be.null;
              expect(res.status).to.be.equal(200);
              expect(res.body).to.be.an("object");
              expect(res.body.farmerID).to.be.equal("6187c957b288576ca24f8257");
              expect(res.body.name).to.be.equal("TestProduct");
              expect(res.body.description).to.be.equal(
                "This is a test product"
              );
              expect(res.body.category).to.be.equal("fruit");
              done();
            });
        });
    });

    it("it should return 400 if the farmerId is not valid", (done) => {
      chai
        .request(app)
        .post("/api/products")
        .send({
          farmerID: "6187c957b288576ca24f",
          name: "TestProduct",
          description: "This is a test product",
          category: "fruit",
        })
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res.status).to.be.equal(400);
          done();
        });
    });

    it("it should return 400 if the Name is not valid", (done) => {
      chai
        .request(app)
        .post("/api/products")
        .send({
          farmerID: "6187c957b288576ca24f8257",
          name: "",
          description: "This is a test product",
          category: "fruit",
        })
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res.status).to.be.equal(400);
          done();
        });
    });

    it("it should return 400 if the Description is not valid", (done) => {
      chai
        .request(app)
        .post("/api/products")
        .send({
          farmerID: "6187c957b288576ca24f8257",
          name: "Test",
          description:
            "This is a test product  more than 100 charas aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
          category: "fruit",
        })
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res.status).to.be.equal(400);
          done();
        });
    });

    it("it should return 400 if the Category is not valid", (done) => {
      chai
        .request(app)
        .post("/api/products")
        .send({
          farmerID: "6187c957b288576ca24f8257",
          name: "Test",
          description: "This is a test product",
          category: "WRONG",
        })
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res.status).to.be.equal(400);
          done();
        });
    });

    it("it should return 500 when mongo fails ", (done) => {
      dao.close();
      chai
        .request(app)
        .post("/api/products")
        .send({
          farmerID: "6187c957b288576ca24f8257",
          name: "Test",
          description: "This is a test product  more than 100 charas ",
          category: "fruit",
        })
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res.status).to.be.equal(500);
          done();
        });
    });
  });
});

// Clients API tests
describe("Clients API tests:", () => {
  beforeEach(() => {
    dao.open();
    mongoUnit.load(testData.clientsCollection);
    mongoUnit.load(testData.ordersCollection2);
    dao.createClientsTextSearchIndexes();
  });

  afterEach(() => {
    mongoUnit.drop();
    dao.close();
  });

  describe("GET /clients[?searchString=:searchString]", () => {
    it("it must retrieve all the clients", (done) => {
      chai
        .request(app)
        .get("/api/clients")
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res.body).to.be.an("array");
          expect(res.status).to.be.equal(200);

          done();
        });
    });

    it("it must retrieve client Domenico Bini", (done) => {
      chai
        .request(app)
        .get("/api/clients?searchString=Domenico")
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res.body).to.be.an("array");
          expect(res.body.length).to.be.equal(1);
          expect(res.body).to.be.eql([
            {
              id: "6187c957b288576ca26f8257",
              email: "client1@test.com",
              role: "client",
              fullName: " Domenico Bini",
              phoneNumber: 3205708803,
              address: "via Domenico Bini,26 Torino,10538",
              wallet: 55.5,
              hasPendingCancelation: true,
            },
          ]);
          expect(res.status).to.be.equal(200);

          done();
        });
    });

    it("it must retrieve client Domenico Bini with hasPendingCancelation=true", (done) => {
      chai
        .request(app)
        .get("/api/clients?searchString=Torino&hasPendingCancelation=true")
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res.body).to.be.an("array");
          expect(res.body.length).to.be.equal(1);
          expect(res.body).to.be.eql([
            {
              id: "6187c957b288576ca26f8257",
              email: "client1@test.com",
              role: "client",
              fullName: " Domenico Bini",
              phoneNumber: 3205708803,
              address: "via Domenico Bini,26 Torino,10538",
              wallet: 55.5,
              hasPendingCancelation: true,
            },
          ]);
          expect(res.status).to.be.equal(200);

          done();
        });
    });

    it("it must retrieve client Andrea Dipr?? with hasPendingCancelation=false", (done) => {
      chai
        .request(app)
        .get("/api/clients?hasPendingCancelation=false")
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res.body).to.be.an("array");
          expect(res.body.length).to.be.equal(4);
          expect(res.body.map((client) => client.id)).to.include.members([
            "6a8fc927bb88c762a26f0000",
            "618d4ad3736f2caf2d3b3ca5",
          ]);
          expect(res.status).to.be.equal(200);

          done();
        });
    });

    it("it must retrieve no client due to a searchString not matching", (done) => {
      chai
        .request(app)
        .get("/api/clients?searchString=dsaffa")
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res.body).to.be.an("array");
          expect(res.body.length).to.be.equal(0);
          expect(res.status).to.be.equal(200);

          done();
        });
    });

    it("it must return a bad request due to hasPendingCancelation not being a boolean", (done) => {
      chai
        .request(app)
        .get("/api/clients?hasPendingCancelation=dsaffa")
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res.status).to.be.equal(400);

          done();
        });
    });

    it("it must fail when mongo fails", (done) => {
      dao.close();
      chai
        .request(app)
        .get("/api/clients")
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res.status).to.be.equal(500);

          done();
        });
    });
  });

  describe("GET /clients/:clientID", () => {
    it("it should retrieve the client associated to the given ID", (done) => {
      chai
        .request(app)
        .get("/api/clients/6a8fc927bb88c762a26f0000")

        .end((err, res) => {
          expect(err).to.be.null;
          expect(res.status).to.be.equal(200);
          expect(res.body).to.be.an("object");
          expect(res.body).to.be.eql({
            id: "6a8fc927bb88c762a26f0000",
            email: "client2@test.com",
            fullName: "Andrea Dipr??",
            phoneNumber: 3205755555,
            role: "client",
            address: "via Andrea Dipre,24 Torino,10538",
            wallet: 0,
            hasPendingCancelation: false,
          });

          done();
        });
    });

    it("it should return 404 not found given a non existing ID", (done) => {
      chai
        .request(app)
        .get("/api/clients/6a8fc927bb88c7fff26f0000")
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res.status).to.be.equal(404);
          done();
        });
    });

    it("it must fail when mongo fails", (done) => {
      dao.close();
      chai
        .request(app)
        .get("/api/clients/6a8fc927bb88c762a26f0000")
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res.status).to.be.equal(500);

          done();
        });
    });
  });

  describe("PATCH /clients/:clientID/wallet", () => {
    it("it must fail when mongo fails", (done) => {
      dao.close();
      chai
        .request(app)
        .patch("/api/clients/6187c957b288576ca26f8257/wallet")
        .send({
          increaseBy: 24.3,
        })
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res.status).to.be.equal(500);

          done();
        });
    });

    it("it must fail when a wrong clientID is given", (done) => {
      chai
        .request(app)
        .patch("/api/clients/6187c957b288521ca26f8257/wallet")
        .send({
          increaseBy: 24.3,
        })
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res.status).to.be.equal(400);

          expect(res.body).to.be.an("object");

          done();
        });
    });

    it("it should update the client wallet", (done) => {
      chai
        .request(app)
        .patch("/api/clients/6187c957b288576ca26f8257/wallet")
        .send({
          increaseBy: 24.3,
        })
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res.status).to.be.equal(200);
          expect(res.body).to.be.an("object");
          expect(res.body.newWalletValue).to.be.equal(79.8);

          done();
        });
    });

    it("it must return 400 when a negative float is given as increaseBy", (done) => {
      chai
        .request(app)
        .patch("/api/clients/6187c957b28sfb6ca26f8257/wallet")
        .send({
          increaseBy: -2.4,
        })
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res.status).to.be.equal(400);

          expect(res.body).to.be.an("object");

          done();
        });
    });

    it("it should update the client wallet and bring not covered orders to waiting status", (done) => {
      chai
        .request(app)
        .patch("/api/clients/144444444444444444444444/wallet")
        .send({
          increaseBy: 12,
        })
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res.status).to.be.equal(200);
          expect(res.body).to.be.an("object");
          expect(res.body.newWalletValue).to.be.equal(12);

          done();
        });
    });
  });
});

//Orders API tests
describe("Orders API tests:", () => {
  beforeEach(() => {
    dao.open();
    mongoUnit.load(testData.ordersCollection);
    mongoUnit.load(testData.productsAvailabilityCollection3);
    mongoUnit.load(testData.clientsCollection);
  });

  afterEach(() => {
    mongoUnit.drop();
    dao.close();
  });

  describe("POST /orders", () => {
    it("it should create a new order of type shipment", (done) => {
      chai
        .request(app)
        .post("/api/orders")
        .send({
          clientID: "6187c957b288576ca26f8257",
          products: [
            { productID: "000000000000000000000001", quantity: 3 },
            { productID: "000000000000000000000004", quantity: 1 },
            { productID: "000000000000000000000006", quantity: 2 },
          ],
          shipmentInfo: {
            type: "shipment",
            address: "Via its real trust me 54",
          },
        })
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res.status).to.be.equal(200);
          const id = res.body.id;

          chai
            .request(app)
            .get("/api/orders/" + id)
            .end((err, res) => {
              expect(err).to.be.null;
              expect(res.status).to.be.equal(200);
              expect(res.body).to.be.an("object");

              expect(res.body.clientID).to.be.equal("6187c957b288576ca26f8257");
              expect(res.body.id).to.be.equal(id);
              expect(res.body.products).to.be.eql([
                {
                  productID: "000000000000000000000001",
                  quantity: 3,
                  packaging: "100g",
                  price: 3.5,
                  status: "waiting",
                },
                {
                  productID: "000000000000000000000004",
                  quantity: 1,
                  packaging: "4 units",
                  price: 2.3,
                  status: "waiting",
                },
                {
                  productID: "000000000000000000000006",
                  quantity: 2,
                  packaging: "1 units",
                  price: 4.5,
                  status: "waiting",
                },
              ]);
              expect(res.body.shipmentInfo).to.be.eql({
                type: "shipment",
                address: "Via its real trust me 54",
              });
              expect(res.body.status).to.be.equal("waiting");
              done();
            });
        });
    });

    it("it should create a new order of type pickUp", (done) => {
      chai
        .request(app)
        .post("/api/orders")
        .send({
          clientID: "6187c957b288576ca26f8257",
          products: [
            { productID: "000000000000000000000001", quantity: 3 },
            { productID: "000000000000000000000004", quantity: 1 },
            { productID: "000000000000000000000006", quantity: 2 },
          ],
          shipmentInfo: {
            type: "pickup",
            pickUpSlot: "41111",
            address: "Via its real trust me 54",
          },
        })
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res.status).to.be.equal(200);
          const id = res.body.id;

          chai
            .request(app)
            .get("/api/orders/" + id)
            .end((err, res) => {
              expect(err).to.be.null;
              expect(res.status).to.be.equal(200);
              expect(res.body).to.be.an("object");

              expect(res.body.clientID).to.be.equal("6187c957b288576ca26f8257");
              expect(res.body.id).to.be.equal(id);
              expect(res.body.products).to.be.eql([
                {
                  productID: "000000000000000000000001",
                  quantity: 3,
                  packaging: "100g",
                  price: 3.5,
                  status: "waiting",
                },
                {
                  productID: "000000000000000000000004",
                  quantity: 1,
                  packaging: "4 units",
                  price: 2.3,
                  status: "waiting",
                },
                {
                  productID: "000000000000000000000006",
                  quantity: 2,
                  packaging: "1 units",
                  price: 4.5,
                  status: "waiting",
                },
              ]);
              expect(res.body.shipmentInfo).to.be.eql({
                type: "pickup",
                pickUpSlot: "41111",
                address: "Via its real trust me 54",
              });
              expect(res.body.status).to.be.equal("waiting");
              done();
            });
        });
    });

    it("it should fail with quantity bigger than availability", (done) => {
      chai
        .request(app)
        .post("/api/orders")
        .send({
          clientID: "6187c957b288576ca26f8257",
          products: [{ productID: "000000000000000000000012", quantity: 32 }],
          shipmentInfo: {
            type: "pickup",
            pickUpSlot: "41111",
            address: "Via its real trust me 54",
          },
        })
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res.status).to.be.equal(400);
          done();
        });
    });

    it("it should create a new order not covered because no money on wallet", (done) => {
      chai
        .request(app)
        .post("/api/orders")
        .send({
          clientID: "777777777777777777777777",
          products: [
            { productID: "000000000000000000000001", quantity: 3 },
            { productID: "000000000000000000000004", quantity: 1 },
            { productID: "000000000000000000000006", quantity: 2 },
          ],
          shipmentInfo: {
            type: "shipment",
            address: "Via its real trust me 54",
          },
        })
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res.status).to.be.equal(200);
          const id = res.body.id;

          chai
            .request(app)
            .get("/api/orders/" + id)
            .end((err, res) => {
              expect(err).to.be.null;
              expect(res.status).to.be.equal(200);
              expect(res.body).to.be.an("object");

              expect(res.body.clientID).to.be.equal("777777777777777777777777");
              expect(res.body.id).to.be.equal(id);
              expect(res.body.products).to.be.eql([
                {
                  productID: "000000000000000000000001",
                  quantity: 3,
                  packaging: "100g",
                  price: 3.5,
                  status: "waiting",
                },
                {
                  productID: "000000000000000000000004",
                  quantity: 1,
                  packaging: "4 units",
                  price: 2.3,
                  status: "waiting",
                },
                {
                  productID: "000000000000000000000006",
                  quantity: 2,
                  packaging: "1 units",
                  price: 4.5,
                  status: "waiting",
                },
              ]);
              expect(res.body.shipmentInfo).to.be.eql({
                type: "shipment",
                address: "Via its real trust me 54",
              });
              expect(res.body.status).to.be.equal("not-covered");
              done();
            });
        });
    });

    it("it should fail to create a new order because wrong client id", (done) => {
      chai
        .request(app)
        .post("/api/orders")
        .send({
          clientID: "77777777777777d777777777",
          products: [
            { productID: "000000000000000000000001", quantity: 3 },
            { productID: "000000000000000000000004", quantity: 1 },
            { productID: "000000000000000000000006", quantity: 2 },
          ],
          shipmentInfo: {
            type: "shipment",
            address: "Via its real trust me 54",
          },
        })
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res.status).to.be.equal(500);
          done();
        });
    });

    it("it should create a new order of type shipment and return it without pickUpSlot since it's not pickUp type", (done) => {
      chai
        .request(app)
        .post("/api/orders")
        .send({
          clientID: "6187c957b288576ca26f8257",
          products: [
            { productID: "000000000000000000000001", quantity: 3 },
            { productID: "000000000000000000000004", quantity: 1 },
            { productID: "000000000000000000000006", quantity: 2 },
          ],
          shipmentInfo: {
            type: "shipment",
            pickUpSlot: "41111",
            address: "Via its real trust me 54",
          },
        })
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res.status).to.be.equal(200);
          const id = res.body.id;

          chai
            .request(app)
            .get("/api/orders/" + id)
            .end((err, res) => {
              expect(err).to.be.null;
              expect(res.status).to.be.equal(200);
              expect(res.body).to.be.an("object");

              expect(res.body.clientID).to.be.equal("6187c957b288576ca26f8257");
              expect(res.body.id).to.be.equal(id);
              expect(res.body.products).to.be.eql([
                {
                  productID: "000000000000000000000001",
                  quantity: 3,
                  packaging: "100g",
                  price: 3.5,
                  status: "waiting",
                },
                {
                  productID: "000000000000000000000004",
                  quantity: 1,
                  packaging: "4 units",
                  price: 2.3,
                  status: "waiting",
                },
                {
                  productID: "000000000000000000000006",
                  quantity: 2,
                  packaging: "1 units",
                  price: 4.5,
                  status: "waiting",
                },
              ]);
              expect(res.body.shipmentInfo).to.be.eql({
                type: "shipment",
                address: "Via its real trust me 54",
              });
              expect(res.body.status).to.be.equal("waiting");
              done();
            });
        });
    });

    it("it should give Bad request error because the address is empty", (done) => {
      chai
        .request(app)
        .post("/api/orders")
        .send({
          clientID: "6187c957b288576ca26f8257",
          products: [{ productID: "6187c957b288576ca26f8258", quantity: -2 }],
          shipmentInfo: {
            type: "shipment",
            address: "",
          },
        })
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res.status).to.be.equal(400);
          expect(res.body).to.be.an("object");
          done();
        });
    });

    it("it should give Bad request error because the pickUpSlot is wrong ", (done) => {
      chai
        .request(app)
        .post("/api/orders")
        .send({
          clientID: "6187c957b288576ca26f8257",
          products: [{ productID: "6187c957b288576ca26f8258", quantity: -2 }],
          shipmentInfo: {
            type: "pickup",
            pickUpSlot: "52359",
            address: "Via Prapappo Ravanello 54",
          },
        })
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res.status).to.be.equal(400);
          expect(res.body).to.be.an("object");
          done();
        });
    });

    it("it should give Bad request error because the type of the shipment is wrong ", (done) => {
      chai
        .request(app)
        .post("/api/orders")
        .send({
          clientID: "6187c957b288576ca26f8257",
          products: [{ productID: "6187c957b288576ca26f8258", quantity: 2 }],
          shipmentInfo: {
            type: "WRONG",
            pickUpSlot: "52359",
            address: "Via Prapappo Ravanello 54",
          },
        })
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res.status).to.be.equal(400);
          expect(res.body).to.be.an("object");
          done();
        });
    });

    it("it should give Bad request error because quantity is negative", (done) => {
      chai
        .request(app)
        .post("/api/orders")
        .send({
          clientID: "6187c957b288576ca26f8257",
          products: [{ productID: "6187c957b288576ca26f8258", quantity: -2 }],
        })
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res.status).to.be.equal(400);
          expect(res.body).to.be.an("object");
          done();
        });
    });
    it("it should give Bad request error when clientID is not mongo db id", (done) => {
      chai
        .request(app)
        .post("/api/orders")
        .send({
          clientID: "1",
          products: [
            { productID: "6187c957b288576ca26f8258", quantity: 3 },
            { productID: "6187c957b288576ca26f8259", quantity: 1 },
            { productID: "6187c957b288576ca26f8250", quantity: 2 },
          ],
        })
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res.status).to.be.equal(400);
          expect(res.body).to.be.an("object");
          done();
        });
    });

    it("it should give Bad request error when clientID is integer", (done) => {
      chai
        .request(app)
        .post("/api/orders")
        .send({
          clientID: 1,
          products: [{ productID: "6187c957b288576ca26f8258", quantity: 3 }],
        })
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res.status).to.be.equal(400);
          expect(res.body).to.be.an("object");

          done();
        });
    });

    it("it should give Bad request error when product ID is integer", (done) => {
      chai
        .request(app)
        .post("/api/orders")
        .send({
          clientID: 1,
          products: [{ productID: 1, quantity: 3 }],
        })
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res.status).to.be.equal(400);
          expect(res.body).to.be.an("object");

          done();
        });
    });

    it("it should give Bad request error because object is not correct", (done) => {
      chai
        .request(app)
        .post("/api/orders")
        .send({
          clientID: "6187c957b288576ca26f8257",
          products: [
            { productID: "6187c957b288576ca26f8258", quantity: 3 },
            { productID: "6187c957b288576ca26f8259", quantity: 1 },
            { productID: "6187c957b288576ca26f8250", quantity: 2 },
          ],
        })
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res.status).to.be.equal(400);
          expect(res.body).to.be.an("object");

          done();
        });
    });

    it("it must fail when mongo fails", (done) => {
      dao.close();
      var day = new Date();
      //shipment dateis valid only if it is for next week and is between wednesday & friday
      //7 days a week, tjursday is day number 4
      var daysToReachNextThursday = 7 - day.getDay() + 4;
      var nextThursday = new Date(
        day.setDate(day.getDate() + daysToReachNextThursday)
      );
      chai
        .request(app)
        .post("/api/orders")
        .send({
          clientID: "6187c957b288576ca26f8257",
          products: [
            { productID: "000000000000000000000001", quantity: 3 },
            { productID: "000000000000000000000004", quantity: 1 },
            { productID: "000000000000000000000006", quantity: 2 },
          ],
          shipmentInfo: {
            type: "pickup",
            pickUpSlot: "32200",
            address: "Via Prapappo Ravanello 54",
          },
        })
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res.status).to.be.equal(500);

          done();
        });
    });
  });

  describe("GET /orders", () => {
    it("it should retrieve the client's orders with given ClientID", (done) => {
      chai
        .request(app)
        .get("/api/orders?clientID=6187c957b288576ca26f8257")
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res.status).to.be.equal(200);
          expect(res.body).to.be.an("array");

          expect(res.body).to.be.eql([
            {
              id: "6187c957b288576ca26f8999",
              clientID: "6187c957b288576ca26f8257",
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
              id: "6187c957b288576ca26f8251",
              clientID: "6187c957b288576ca26f8257",
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
          ]);

          done();
        });
    });

    it("it should return an empty array if there are no orders for given clientID", (done) => {
      chai
        .request(app)
        .get("/api/orders?clientID=6187c957b288576ca26f8000")
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res.status).to.be.equal(200);
          expect(res.body).to.be.an("array");
          expect(res.body.length).to.be.equal(0);
          done();
        });
    });

    it("it should return an error if the ID passed is not valid", (done) => {
      chai
        .request(app)
        .get("/api/orders?clientID=68000")
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res.status).to.be.equal(400);
          done();
        });
    });

    it("it must fail when mongo fails", (done) => {
      dao.close();
      chai
        .request(app)
        .get("/api/orders?clientID=6187c957b288576ca26f8257")
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res.status).to.be.equal(500);

          done();
        });
    });
  });

  describe("PATCH /orders", () => {
    it("it should update the order's status with given orderID", (done) => {
      chai
        .request(app)
        .patch("/api/orders/6187c957b288576ca26f8251/complete")
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res.status).to.be.equal(204);
        });

      chai
        .request(app)
        .get("/api/orders/6187c957b288576ca26f8251")
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res.status).to.be.equal(200);
          expect(res.body).to.be.eql({
            id: "6187c957b288576ca26f8251",
            clientID: "6187c957b288576ca26f8257",
            products: [
              { productID: "6187c957b288576ca26f8258", quantity: 3 },
              { productID: "6187c957b288576ca26f8259", quantity: 1 },
              { productID: "6187c957b288576ca26f8250", quantity: 2 },
            ],
            status: "done",
            totalPrice: "6",
            createdAt: "2021-11-16T13:00:07.616Z",
            shipmentInfo: {
              type: "pickup",
              pickUpSlot: "32200",
              address: "Via Prapappo Ravanello 54",
            },
          });
          done();
        });
    });

    it("it should not update the order if it is not in PREPARING status", (done) => {
      chai
        .request(app)
        .patch("/api/orders/6187c957b288576ca26f8990/complete")
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res.status).to.be.equal(204);
        });
      chai
        .request(app)
        .get("/api/orders/6187c957b288576ca26f8990")
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res.status).to.be.equal(200);
          expect(res.body).to.be.eql({
            id: "6187c957b288576ca26f8990",
            clientID: "6187c957b288576ca26f8251",
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
          });
          done();
        });
    });

    it("Even if the ID passed is valid but not present in the collection, the response status should be 204", (done) => {
      chai
        .request(app)
        .patch("/api/orders/6187c957b288576ca26f8259/complete")
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res.status).to.be.equal(204);
          done();
        });
    });

    it("it should return an error if the ID passed is not valid", (done) => {
      chai
        .request(app)
        .patch("/api/orders/12/complete")
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res.status).to.be.equal(400);
          done();
        });
    });

    it("it must fail when mongo fails", (done) => {
      dao.close();
      chai
        .request(app)
        .patch("/api/orders/6187c957b288576ca26f8251/complete")
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res.status).to.be.equal(500);

          done();
        });
    });
  });

  describe("GET /orders/:orderID", () => {
    it("it should return 404 if the order with given orderID doesn't exists", (done) => {
      chai
        .request(app)
        .get("/api/orders/6187c957b288576ca26f0000")
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res.status).to.be.equal(404);
          done();
        });
    });

    it("it should retrieve the order with given orderID", (done) => {
      chai
        .request(app)
        .get("/api/orders/6187c957b288576ca26f8251")
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res.status).to.be.equal(200);
          expect(res.body).to.be.an("object");
          expect(res.body).to.be.eql({
            id: "6187c957b288576ca26f8251",
            clientID: "6187c957b288576ca26f8257",
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
          });

          done();
        });
    });

    it("it should return an error if the ID passed is not valid", (done) => {
      chai
        .request(app)
        .get("/api/orders/6187c957b288576ca26f8")
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res.status).to.be.equal(400);
          done();
        });
    });

    it("it must fail when mongo fails", (done) => {
      dao.close();
      chai
        .request(app)
        .get("/api/orders/6187c957b288576ca26f8251")
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res.status).to.be.equal(500);

          done();
        });
    });
  });
});

//SignupClient

describe("Clients API tests:", () => {
  beforeEach(() => {
    dao.open();
    mongoUnit.load(testData.clientsCollection);
  });

  afterEach(() => {
    mongoUnit.drop();
    dao.close();
  });

  describe("POST /clients/signup", () => {
    it("it should create a new client", (done) => {
      chai
        .request(app)
        .post("/api/clients/signup")
        .send({
          fullName: "Mario Verdi",
          phoneNumber: "1236678",
          email: "client@test.com",
          password: "password",
          address: "via giacinto,22 Torino, 10127",
        })
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res.status).to.be.equal(200);
          expect(res.body).to.be.an("object");
          expect(res.body.email).to.be.equal("client@test.com");
          expect(res.body.fullName).to.be.equal("Mario Verdi");

          done();
        });
    });

    it("it must fail when an invalid email is passed", (done) => {
      chai
        .request(app)
        .post("/api/clients/signup")
        .send({
          fullName: "Mario Verdi",
          phoneNumber: "1236678",
          email: "notanemail",
          password: "password",
          address: "via giacinto,22 Torino, 10127",
        })
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res.status).to.be.equal(400);

          done();
        });
    });

    it("it must fail when a password too short is passed", (done) => {
      chai
        .request(app)
        .post("/api/clients/signup")
        .send({
          fullName: "Mario Verdi",
          phoneNumber: "1236678",
          email: "client@test.com",
          password: "pas",
          address: "via giacinto,22 Torino, 10127",
        })
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res.status).to.be.equal(400);

          done();
        });
    });

    it("it must fail when a fullName too long is passed", (done) => {
      chai
        .request(app)
        .post("/api/clients/signup")
        .send({
          fullName: "Mario VerdiMario VerdiMario VerdiMario VerdiMario Verdi",
          phoneNumber: "1236678",
          email: "client@test.com",
          password: "password",
          address: "via giacinto,22 Torino, 10127",
        })
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res.status).to.be.equal(400);

          done();
        });
    });

    it("it must fail when mongo fails", (done) => {
      dao.close();
      chai
        .request(app)
        .post("/api/clients/signup")
        .send({
          fullName: "Mario Verdi",
          phoneNumber: "1236678",
          email: "client@test.com",
          password: "password",
          address: "via giacinto,22 Torino, 10127",
        })
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res.status).to.be.equal(500);

          done();
        });
    });
  });
});

//
//create client test
//

describe("Clients API tests:", () => {
  beforeEach(() => {
    dao.open();
    mongoUnit.load(testData.clientsCollection);
    dao.createClientsTextSearchIndexes();
  });

  afterEach(() => {
    mongoUnit.drop();
    dao.close();
  });

  describe("POST /clients", () => {
    it("it should create a new client", (done) => {
      chai
        .request(app)
        .post("/api/clients")
        .send({
          fullName: "Ehsan Ansari",
          phoneNumber: "1236678",
          email: "ansari@email.com",
          address: "via giacinto,22 Torino, 10127",
        })
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res.status).to.be.equal(200);
          expect(res.body).to.be.an("object");
          expect(res.body.email).to.be.equal("ansari@email.com");
          expect(res.body.fullName).to.be.equal("Ehsan Ansari");
          expect(res.body.wallet).to.be.equal(0.0);
          done();
        });
    });

    it("it must fail when an invalid email is passed", (done) => {
      chai
        .request(app)
        .post("/api/clients")
        .send({
          fullName: "Ehsan Ansari",
          phoneNumber: "1236678",
          email: "nomail",
          address: "via giacinto,22 Torino, 10127",
        })
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res.status).to.be.equal(400);
          done();
        });
    });

    it("it must fail when a fullName too long is passed", (done) => {
      chai
        .request(app)
        .post("/api/clients")
        .send({
          fullName:
            "Ehsan Ansari Mario VerdiMario VerdiMario VerdiMario VerdiMario Verdi",
          phoneNumber: "1236678",
          email: "ansari@email.com",
          address: "via giacinto,22 Torino, 10127",
        })
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res.status).to.be.equal(400);

          done();
        });
    });

    it("it must fail when mongo fails", (done) => {
      dao.close();
      chai
        .request(app)
        .post("/api/clients")
        .send({
          fullName: "Ehsan Ansari",
          phoneNumber: "1236678",
          email: "ansari@email.com",
          address: "via giacinto,22 Torino, 10127",
        })
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res.status).to.be.equal(500);

          done();
        });
    });
  });
});

//
//farmer tests
//

describe("Farmers API tests:", () => {
  beforeEach(() => {
    dao.open();
    mongoUnit.load(testData.productsCollection);
    mongoUnit.load(testData.productsAvailabilityCollection2);
    dao.createProductsTextSearchIndexes();
  });

  afterEach(() => {
    mongoUnit.drop();
    dao.close();
  });

  it("it must return apples products, one of them with availability set to null", (done) => {
    chai
      .request(app)
      .get(
        "/api/farmers/67696f76616a6a6a31a23334/products?category=fruit&searchString=apple"
      )
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res.status).to.be.equal(200);
        expect(res.body.map((product) => product.name)).to.include.members([
          "Golden Delicious Apple",
          "Stark Delicious Apple",
          "Royal Gala Apple",
        ]);
        expect(
          res.body
            .filter((product) => product.name === "Royal Gala Apple")
            .map((product) => product.availability)[0]
        ).to.be.null;
        expect(
          res.body
            .filter((product) => product.name !== "Royal Gala Apple")
            .map((product) => product.availability)[0]
        ).to.be.not.null;
        expect(
          res.body
            .filter((product) => product.name !== "Royal Gala Apple")
            .map((product) => product.availability)[1]
        ).to.be.not.null;
        done();
      });
  });

  it("it must return only available apples products", (done) => {
    chai
      .request(app)
      .get(
        "/api/farmers/67696f76616a6a6a31a23334/products?category=fruit&searchString=apple&hasAvailabilitySet=true"
      )
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res.status).to.be.equal(200);
        expect(res.body.map((product) => product.name)).to.include.members([
          "Golden Delicious Apple",
          "Stark Delicious Apple",
        ]);
        expect(res.body.every((product) => product.availability !== null)).to.be
          .true;
        done();
      });
  });

  it("it must return only not available apples products", (done) => {
    chai
      .request(app)
      .get(
        "/api/farmers/67696f76616a6a6a31a23334/products?category=fruit&searchString=apple&hasAvailabilitySet=false"
      )
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res.status).to.be.equal(200);
        expect(res.body.map((product) => product.name)).to.include.members([
          "Royal Gala Apple",
        ]);
        expect(
          res.body
            .filter((product) => product.name === "Royal Gala Apple")
            .map((product) => product.availability)[0]
        ).to.be.null;
        done();
      });
  });

  it("it must return available fruit products", (done) => {
    chai
      .request(app)
      .get(
        "/api/farmers/67696f76616a6a6a31a23334/products?category=fruit&hasAvailabilitySet=true"
      )
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res.status).to.be.equal(200);
        expect(res.body.map((product) => product.name)).to.include.members([
          "Golden Delicious Apple",
          "Stark Delicious Apple",
          "Banana",
          "Pineapple",
        ]);
        expect(res.body.every((product) => product.availability !== null)).to.be
          .true;
        done();
      });
  });

  it("it must return bad request due to the farmerID not being a mongoID", (done) => {
    chai
      .request(app)
      .get(
        "/api/farmers/67696f7661s1a23334/products?category=fruit&hasAvailabilitySet=true"
      )
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res.status).to.be.equal(400);
        done();
      });
  });

  it("it must fail when mongo fails", (done) => {
    dao.close();
    chai
      .request(app)
      .get(
        "/api/farmers/67696f76616a6a6a31a23334/products?category=fruit&hasAvailabilitySet=true"
      )
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res.status).to.be.equal(500);
        done();
      });
  });

  it("If there are no available products with applied filters then it should return an empty array", (done) => {
    chai
      .request(app)
      .get(
        "/api/farmers/4c7564443132333435363738/products?category=milk&hasAvailabilitySet=true"
      )
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res.status).to.be.equal(200);
        expect(res.body).to.be.an("array");
        expect(res.body.length).to.be.equal(0);
        done();
      });
  });

  it("If no filters are applied it should return every farmer products. Some of them (6) with availability not null.", (done) => {
    chai
      .request(app)
      .get("/api/farmers/67696f76616a6a6a31a23334/products")
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res.status).to.be.equal(200);
        expect(res.body).to.be.an("array");
        expect(res.body.length).to.be.equal(10);
        expect(
          res.body.filter((product) => product.availability !== null).length
        ).to.be.equal(6);
        done();
      });
  });
});

// User Login API TESTS
describe("User Login API tests:", () => {
  beforeEach(() => {
    dao.open();
    mongoUnit.load({
      ...testData.clientsCollection,
      ...testData.farmersCollection,
      ...testData.employeesCollection,
      ...testData.managersCollection,
    });
  });

  afterEach(() => {
    mongoUnit.drop();
    dao.close();
  });

  describe("POST /users/login", () => {
    it("it should success with a client", (done) => {
      chai
        .request(app)
        .post("/api/users/login")
        .send({ username: "ehsanansari@gmail.com", password: "123456789" })
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res.status).to.be.equal(200);
          expect(res.body).to.be.an("object");
          expect(res.body.email).to.be.equal("ehsanansari@gmail.com");
          expect(res.body.password).not.to.exist;
          expect(res.body.role).to.be.equal("client");
          expect(res.body.id).to.be.equal("618d4ad3736f2caf2d3b3ca5");
          expect(res.body.wallet).to.be.equal(55.5);
          expect(res.body.address).to.be.equal(
            "fsfsaf dsafsa fsafsa,26 Milano,12342"
          );

          done();
        });
    });
    it("it should success with a employee", (done) => {
      chai
        .request(app)
        .post("/api/users/login")
        .send({ username: "employee1@test.com", password: "123456789" })
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res.status).to.be.equal(200);
          expect(res.body).to.be.an("object");
          expect(res.body.email).to.be.equal("employee1@test.com");
          expect(res.body.password).not.to.exist;
          expect(res.body.role).to.be.equal("employee");
          expect(res.body.id).to.be.equal("6187c957b288576ca26f8257");

          done();
        });
    });
    it("it should success with a farmer", (done) => {
      chai
        .request(app)
        .post("/api/users/login")
        .send({ username: "farmer1@test.com", password: "123456789" })
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res.status).to.be.equal(200);
          expect(res.body).to.be.an("object");
          expect(res.body.email).to.be.equal("farmer1@test.com");
          expect(res.body.password).not.to.exist;
          expect(res.body.role).to.be.equal("farmer");
          expect(res.body.id).to.be.equal("6187c957b288576ca24f8257");

          done();
        });
    });

    it("it must fail when an invalid email is passed", (done) => {
      chai
        .request(app)
        .post("/api/users/login")
        .send({
          username: "nomail",
          password: "123456789",
        })
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res.status).to.be.equal(401);

          done();
        });
    });
    it("it must fail when a not recorded email is entered ", (done) => {
      chai
        .request(app)
        .post("/api/users/login")
        .send({
          username: "notrecorded@gmail.com",
          password: "123456789",
        })
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res.status).to.be.equal(401);

          done();
        });
    });
    it("it must fail when password is entered wrong", (done) => {
      chai
        .request(app)
        .post("/api/users/login")
        .send({
          username: "ehsanansari@gmail.com",
          password: "wrongpassword",
        })
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res.status).to.be.equal(401);

          done();
        });
    });
    it("it must fail when email and  password is entered wrong", (done) => {
      chai
        .request(app)
        .post("/api/users/login")
        .send({
          username: "blabla@gmail.com",
          password: "wrongpassword",
        })
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res.statusCode).to.be.equal(401);

          done();
        });
    });

    it("it should success with a manager", (done) => {
      chai
        .request(app)
        .post("/api/users/login")
        .send({
          username: "manager1@test.com",
          password: "123456789",
        })
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res.status).to.be.equal(200);
          expect(res.body).to.be.an("object");
          expect(res.body.email).to.be.equal("manager1@test.com");
          expect(res.body.password).not.to.exist;
          expect(res.body.role).to.be.equal("manager");
          expect(res.body.id).to.be.equal("1187c957b288576ca26f8257");

          done();
        });
    });
  });

  describe("GET /users/current", () => {
    before((done) => {
      chai
        .request(app)
        .post("/api/users/login")
        .send({ username: "farmer1@test.com", password: "123456789" })
        .then(() => done());
    });

    it("it must success with no currently logged user", (done) => {
      chai
        .request(app)
        .get("/api/users/current")
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res.status).to.be.equal(204);

          done();
        });
    });

    it("it must success with a currently logged user", (done) => {
      chai
        .request(app)
        .get("/api/users/current")
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res.status).to.be.equal(204);

          done();
        });
    });
  });

  describe("DELETE /users/current", () => {
    before((done) => {
      chai
        .request(app)
        .post("/api/users/login")
        .send({ username: "farmer1@test.com", password: "123456789" })
        .then(() => done());
    });

    it("it must success with a currently logged user", (done) => {
      chai
        .request(app)
        .delete("/api/users/current")
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res.status).to.be.equal(204);
          done();
        });
    });

    it("it must success with a currently logged user", (done) => {
      chai
        .request(app)
        .delete("/api/users/current")
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res.status).to.be.equal(204);

          done();
        });
    });
  });
});

// Product Availability API tests
describe("Product Availability API tests:", () => {
  describe("GET /availabilities", () => {
    beforeEach(() => {
      dao.open();
      mongoUnit.load(testData.productsAvailabilityCollection);
    });

    afterEach(() => {
      mongoUnit.drop();
      dao.close();
    });

    it("it should success with an existing product availability", (done) => {
      chai
        .request(app)
        .get("/api/availabilities/000000000000000000000002")
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res.status).to.be.equal(200);
          expect(res.body).to.be.an("object");
          expect(res.body.id).to.be.equal("000000000000000000000002");
          expect(res.body.farmerID).to.be.equal("4c7564443132333435363738");
          expect(res.body.productID).to.be.equal("000000000000000000000011");
          expect(res.body.week).to.be.equal(15);
          expect(res.body.year).to.be.equal(2020);
          expect(res.body.status).to.be.equal("waiting");
          expect(res.body.price).to.be.equal(2.3);
          expect(res.body.packaging).to.be.equal("4 units");
          expect(res.body.quantity).to.be.equal(25);
          expect(res.body.reservedQuantity).to.be.equal(0);

          done();
        });
    });
    it("it should fail with non existing product availability", (done) => {
      chai
        .request(app)
        .get("/api/availabilities/000010000010000010000011")
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res.status).to.be.equal(400);
          done();
        });
    });
    it("it should fail when mongo fails", (done) => {
      dao.close();
      chai
        .request(app)
        .get("/api/availabilities/000010000010000010000011")
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res.status).to.be.equal(500);
          done();
        });
    });
  });

  describe("PATCH /availabilities", () => {
    beforeEach(() => {
      dao.open();
      mongoUnit.load(testData.productsAvailabilityCollection);
    });

    afterEach(() => {
      mongoUnit.drop();
      dao.close();
    });

    it("it should success with an existing product availability", (done) => {
      chai
        .request(app)
        .patch("/api/availabilities/000000000000000000000002")
        .send({ quantity: 50 })
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res.status).to.be.equal(204);

          dao
            .getProductAvailabilityByID("000000000000000000000002")
            .then((pa) => {
              expect(pa._id.toString()).to.be.equal("000000000000000000000002");
              expect(pa.farmerID.toString()).to.be.equal(
                "4c7564443132333435363738"
              );
              expect(pa.productID.toString()).to.be.equal(
                "000000000000000000000011"
              );
              expect(pa.week).to.be.equal(15);
              expect(pa.year).to.be.equal(2020);
              expect(pa.status).to.be.equal("waiting");
              expect(pa.price).to.be.equal(2.3);
              expect(pa.packaging).to.be.equal("4 units");
              expect(pa.quantity).to.be.equal(50);
              expect(pa.reservedQuantity).to.be.equal(0);
              done();
            });
        });
    });
    it("it should fail with non existing product availability", (done) => {
      chai
        .request(app)
        .patch("/api/availabilities/000010000010000010000011")
        .send({ quantity: 50 })
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res.status).to.be.equal(400);
          done();
        });
    });
    it("it should fail when mongo fails", (done) => {
      dao.close();
      chai
        .request(app)
        .patch("/api/availabilities/000010000010000010000011")
        .send({ quantity: 50 })
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res.status).to.be.equal(500);
          done();
        });
    });
  });

  describe("PATCH /availabilities/{id}/confirm", () => {
    beforeEach(() => {
      dao.open();
      mongoUnit.load(testData.confirmProductAvailabilityCollections);
    });

    afterEach(() => {
      mongoUnit.drop();
      dao.close();
    });
    /*
    pa:
    - success
    - not exist
    - not in waiting state

    Ordersprod:
    - full
    - modif
    - canc

    orders
    - canc
    */

    it("it should success with an existing product availability with associated orders", (done) => {
      chai
        .request(app)
        .patch("/api/availabilities/000000000000000000000001/confirm")
        .end(async (err, res) => {
          expect(err).to.be.null;
          expect(res.status).to.be.equal(204);

          await Promise.all([
            dao.getProductAvailabilityByID("000000000000000000000001"),
            dao.getOrderByID("000000000000000000000001"),
            dao.getOrderByID("000000000000000000000002"),
            dao.getOrderByID("000000000000000000000003"),
          ])
            .then((results) => {
              let [pa, ocon, omod, ocan] = results;
              // Check confirmed availability
              expect(pa._id.toString()).to.be.equal("000000000000000000000001");
              expect(pa.farmerID.toString()).to.be.equal(
                "000000000000000000000001"
              );
              expect(pa.productID.toString()).to.be.equal(
                "000000000000000000000001"
              );
              expect(pa.week).to.be.equal(49);
              expect(pa.year).to.be.equal(2021);
              expect(pa.status).to.be.equal("confirmed");
              expect(pa.price).to.be.equal(3.5);
              expect(pa.packaging).to.be.equal("100g");
              expect(pa.quantity).to.be.equal(5);
              expect(pa.reservedQuantity).to.be.equal(0);

              // Check order with product confirmed
              expect(ocon._id.toString()).to.be.equal(
                "000000000000000000000001"
              );
              expect(ocon.products[0].status).to.be.equal("confirmed");
              expect(ocon.products[0].quantity).to.be.equal(3);
              expect(ocon.status).to.be.equal("waiting");
              expect(ocon.totalPrice).to.be.equal(15.5);

              // Check order with product modified
              expect(omod._id.toString()).to.be.equal(
                "000000000000000000000002"
              );
              expect(omod.products[0].status).to.be.equal("modified");
              expect(omod.products[0].quantity).to.be.equal(2);
              expect(omod.status).to.be.equal("waiting");
              expect(omod.totalPrice).to.be.equal(13);

              // Check order with product canceled
              expect(ocan._id.toString()).to.be.equal(
                "000000000000000000000003"
              );
              expect(ocan.products[0].status).to.be.equal("canceled");
              expect(ocan.products[0].quantity).to.be.equal(0);
              expect(ocan.status).to.be.equal("canceled");
              expect(ocan.totalPrice).to.be.equal(0);
            })
            .catch((e) => {
              throw e;
            });

          done();
        });
    });

    it("it should success with an existing product availability without associated orders", (done) => {
      chai
        .request(app)
        .patch("/api/availabilities/000000000000000000000002/confirm")
        .end(async (err, res) => {
          expect(err).to.be.null;
          expect(res.status).to.be.equal(204);

          await dao
            .getProductAvailabilityByID("000000000000000000000002")
            .then((pa) => {
              // Check confirmed availability
              expect(pa._id.toString()).to.be.equal("000000000000000000000002");
              expect(pa.farmerID.toString()).to.be.equal(
                "000000000000000000000002"
              );
              expect(pa.productID.toString()).to.be.equal(
                "000000000000000000000002"
              );
              expect(pa.week).to.be.equal(49);
              expect(pa.year).to.be.equal(2021);
              expect(pa.status).to.be.equal("confirmed");
              expect(pa.price).to.be.equal(3.5);
              expect(pa.packaging).to.be.equal("100g");
              expect(pa.quantity).to.be.equal(5);
              expect(pa.reservedQuantity).to.be.equal(0);
            })
            .catch((e) => {
              throw e;
            });

          done();
        });
    });

    it("it should fail with non existing product availability", (done) => {
      chai
        .request(app)
        .patch("/api/availabilities/000000001000000000000001/confirm")
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res.status).to.be.equal(400);
          done();
        });
    });

    it("it should fail when mongo fails", (done) => {
      dao.close();
      chai
        .request(app)
        .patch("/api/availabilities/000010000010000010000011/confirm")
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res.status).to.be.equal(500);
          done();
        });
    });
  });
});

describe("manager functions", function () {
  // add a test hook
  beforeEach(function () {
    dao.open();
    mongoUnit.load({
      ...testData.managersCollection,
    });
  });

  afterEach(() => {
    mongoUnit.drop();
    dao.close();
  });

  // test a functionality
  it("getManagerByID works", async () => {
    // add an assertion

    let user = await dao.getManagerByID("1187c957b288576ca26f8257");

    expect(user.email).to.be.equal("manager1@test.com");
    expect(user.fullName).to.be.equal("Mario Biondi");
    expect(user.role).to.be.equal("manager");
  });
  it("getManagerByEmail works", async () => {
    // add an assertion

    let user = await dao.getManagerByEmail("manager1@test.com");

    expect(user.email).to.be.equal("manager1@test.com");
    expect(user.fullName).to.be.equal("Mario Biondi");
    expect(user.role).to.be.equal("manager");
  });

  it("ManagerInfo constructor works", async () => {
    const { ManagerInfo } = require("../models/manager_info");
    let managerInfo = new ManagerInfo(
      "2187c957b288576ca26f8257",
      "manager2@test.com",
      "123456789",
      "Manager 2"
    );

    expect(managerInfo.email).to.be.equal("manager2@test.com");
    expect(managerInfo.fullName).to.be.equal("Manager 2");
    expect(managerInfo.role).to.be.equal("manager");
  });

  it("ManagerInfoResult constructor works", async () => {
    const { ManagerInfoResult } = require("../models/manager_info_result");
    let managerInfo = new ManagerInfoResult(
      "2187c957b288576ca26f8257",
      "manager2@test.com",

      "Manager 2"
    );
    expect(managerInfo.email).to.be.equal("manager2@test.com");
    expect(managerInfo.fullName).to.be.equal("Manager 2");
    expect(managerInfo.role).to.be.equal("manager");
  });

  it("fromManagerInfo function works", async () => {
    const { ManagerInfoResult } = require("../models/manager_info_result");
    const { ManagerInfo } = require("../models/manager_info");

    let managerInfo = new ManagerInfo(
      "2187c957b288576ca26f8257",
      "manager2@test.com",
      "123456789",
      "Manager 2"
    );

    let managerInfoResult = ManagerInfoResult.fromManagerInfo(managerInfo);

    expect(managerInfoResult.email).to.be.equal("manager2@test.com");
    expect(managerInfoResult.fullName).to.be.equal("Manager 2");
    expect(managerInfoResult.role).to.be.equal("manager");
  });

  it("fromMongoJSON ManagerInfoResult function works", async () => {
    const { ManagerInfoResult } = require("../models/manager_info_result");

    let obj = {
      id: "2187c957b288576ca26f8257",
      email: "manager2@test.com",
      password: "123456789",
      fullName: "Manager 2",
    };

    let managerInfoResult = ManagerInfoResult.fromMongoJSON(obj);

    expect(managerInfoResult.email).to.be.equal("manager2@test.com");
    expect(managerInfoResult.fullName).to.be.equal("Manager 2");
    expect(managerInfoResult.role).to.be.equal("manager");
  });

  it("fromMongoJSON ManagerInfo function works", async () => {
    const { ManagerInfo } = require("../models/manager_info");

    let obj = {
      id: "2187c957b288576ca26f8257",
      email: "manager2@test.com",
      password: "123456789",
      fullName: "Manager 2",
    };

    let managerInfoResult = ManagerInfo.fromMongoJSON(obj);

    expect(managerInfoResult.email).to.be.equal("manager2@test.com");
    expect(managerInfoResult.fullName).to.be.equal("Manager 2");
    expect(managerInfoResult.role).to.be.equal("manager");
  });

  it("getUserByEmail works", async () => {
    let user = await dao.getUserByEmail("manager1@test.com");
    expect(user.email).to.be.equal("manager1@test.com");
    expect(user.fullName).to.be.equal("Mario Biondi");
    expect(user.role).to.be.equal("manager");
  });
});

// Employees API tests
describe("Managers API tests:", () => {
  beforeEach(() => {
    dao.open();
    mongoUnit.load(testData.managersCollection);
  });

  afterEach(() => {
    mongoUnit.drop();
    dao.close();
  });

  describe("GET /managers/:managerID", () => {
    it("it should retrieve the manager associated to the given ID", (done) => {
      chai
        .request(app)
        .get("/api/managers/1187c957b288576ca26f8257")
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res.status).to.be.equal(200);
          expect(res.body).to.be.an("object");
          expect(res.body.fullName).to.be.equal("Mario Biondi");
          done();
        });
    });

    it("it should fail when the manager associated to the given ID doesn't exist", (done) => {
      chai
        .request(app)
        .get("/api/managers/9997c957b288576ca26f8257")
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res.status).to.be.equal(404);
          done();
        });
    });

    it("it must fail when an invalid Mongo ID is passed", (done) => {
      chai
        .request(app)
        .get("/api/employees/test")
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res.status).to.be.equal(400);

          done();
        });
    });

    it("it must fail when mongo fails", (done) => {
      dao.close();
      chai
        .request(app)
        .get("/api/managers/6187c957b288576ca26f8257")
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res.status).to.be.equal(500);

          done();
        });
    });
  });
});

//
//BOT tests
//
describe("Telgeram BOT API tests:", () => {
  beforeEach(() => {
    dao.open();
    mongoUnit.load(testData.userTelegramCollection);
    dao.createUniqueTelegramUserIndex();
  });
  afterEach(() => {
    mongoUnit.drop();
    dao.close();
  });

  describe("POST /telegram/users", () => {
    it("it should write in the DB the new user", (done) => {
      chai
        .request(app)
        .post("/api/telegram/users")
        .send({ chatID: "100000001" })
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res.status).to.be.equal(200);
          expect(res.body).to.be.an("object");
          expect(res.body.acknowledged).to.be.eql(true);
          done();
        });
    });

    it("it should return an error if the chatID is not a integer", (done) => {
      chai
        .request(app)
        .post("/api/telegram/users")
        .send({ chatID: "100000000asdac" })
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res.status).to.be.equal(400);
          done();
        });
    });

    it("it should return an error if the chatID is already present in the DB", (done) => {
      chai
        .request(app)
        .post("/api/telegram/users")
        .send({ chatID: "371107506" })
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res.status).to.be.equal(500);
          done();
        });
    });

    it("it must fail when mongo fails", (done) => {
      dao.close();
      chai
        .request(app)
        .post("/api/telegram/users")
        .send({ chatID: "100000000" })
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res.status).to.be.equal(500);
          done();
        });
    });
  });

  describe("GET /telegram/users", () => {
    it("it should returns all telegram users", (done) => {
      chai
        .request(app)
        .get("/api/telegram/users")
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res.status).to.be.equal(200);
          expect(res.body).to.be.an("array");
          expect(res.body).to.be.eql([
            {
              _id: "6187c957b288576ca26f8257",
              chatID: 371107506,
            },
            {
              _id: "6187c957b288576ca26f8252",
              chatID: 1322211351,
            },
          ]);
          done();
        });
    });

    it("it must fail when mongo fails", (done) => {
      dao.close();
      chai
        .request(app)
        .get("/api/telegram/users")
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res.status).to.be.equal(500);
          done();
        });
    });
  });
});

// Stats API tests
describe("Stats API tests", () => {
  const [currentWeek, currentYear] = getCurrentWeekClient();
  beforeEach(() => {
    dao.open();
    mongoUnit.load(testData.ordersCollection3);
  });

  afterEach(() => {
    mongoUnit.drop();
    dao.close();
  });

  describe("GET /stats/orders/unretrieved/weekly", () => {
    it("it should retrieve weekly unretrieved stats correctly", (done) => {
      chai
        .request(app)
        .get(
          `/api/stats/orders/unretrieved/weekly?week=${currentWeek}&year=${currentYear}`
        )
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res.status).to.be.equal(200);
          expect(res.body).to.be.an("object");
          expect(res.body.totalCount).to.be.equal(3);
          expect(res.body.unretrievedCount).to.be.equal(1);

          done();
        });
    });

    it("it should return all time unretrieved orders stats, no query in the request", (done) => {
      chai
        .request(app)
        .get(`/api/stats/orders/unretrieved/weekly`)
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res.status).to.be.equal(200);
          expect(res.body).to.be.an("object");
          expect(res.body.totalCount).to.be.equal(6);
          expect(res.body.unretrievedCount).to.be.equal(3);

          done();
        });
    });

    it("it should return bad request due to wrong query params type", (done) => {
      chai
        .request(app)
        .get(
          `/api/stats/orders/unretrieved/weekly?week=lololol&year=${currentYear}`
        )
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res.status).to.be.equal(400);

          done();
        });
    });

    it("it should return bad request due to missing query param week", (done) => {
      chai
        .request(app)
        .get(`/api/stats/orders/unretrieved/weekly?year=${currentYear}`)
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res.status).to.be.equal(400);

          done();
        });
    });

    it("it should fail when mongo fails", (done) => {
      dao.close();
      chai
        .request(app)
        .get(`/api/stats/orders/unretrieved/weekly`)
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res.status).to.be.equal(500);

          done();
        });
    });
  });

  describe("GET /stats/orders/unretrieved/timeInterval", () => {
    it("it should retrieve time interval unretrieved stats correctly", (done) => {
      chai
        .request(app)
        .get(
          `/api/stats/orders/unretrieved/timeInterval?startWeek=${
            currentWeek - 2
          }&startYear=${currentYear}&endWeek=${
            currentWeek + 1
          }&endYear=${currentYear}`
        )
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res.status).to.be.equal(200);
          expect(res.body).to.be.an("object");
          expect(res.body.totalCount).to.be.equal(5);
          expect(res.body.unretrievedCount).to.be.equal(3);

          done();
        });
    });

    it("it should return bad request due to wrong query params type", (done) => {
      chai
        .request(app)
        .get(
          `/api/stats/orders/unretrieved/timeInterval?startWeek=${
            currentWeek - 2
          }&startYear=ok&endWeek=${currentWeek + 1}&endYear=true`
        )
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res.status).to.be.equal(400);

          done();
        });
    });

    it("it should return bad request due to missing query params endWeek and endYear", (done) => {
      chai
        .request(app)
        .get(
          `/api/stats/orders/unretrieved/timeInterval?startWeek=${currentWeek}&startYear=${currentYear}`
        )
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res.status).to.be.equal(400);

          done();
        });
    });

    it("it should return bad request due to missing query params", (done) => {
      chai
        .request(app)
        .get(`/api/stats/orders/unretrieved/timeInterval`)
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res.status).to.be.equal(400);

          done();
        });
    });

    it("it should fail when mongo fails", (done) => {
      dao.close();
      chai
        .request(app)
        .get(
          `/api/stats/orders/unretrieved/timeInterval?startWeek=${
            currentWeek - 2
          }&startYear=${currentYear}&endWeek=${
            currentWeek + 1
          }&endYear=${currentYear}`
        )
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res.status).to.be.equal(500);

          done();
        });
    });
  });
});
