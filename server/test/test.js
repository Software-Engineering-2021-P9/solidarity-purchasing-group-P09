let chai = require("chai");
let expect = chai.expect;
let chaiHttp = require("chai-http");
let dao = require("../dao/dao");
chai.use(chaiHttp);

// This will contain the main server app, needed to listen for requests.
// This is initialized when the mock MongoDB initialization is completed.
let app;

// Init mock MongoDB
const mongoUnit = require("mongo-unit");
let testData = require("./test-data");

const mongoTestDBName = "spg-test";
mongoUnit.start({ dbName: mongoTestDBName }).then(() => {
  process.env.MONGO_CONN_STR = mongoUnit.getUrl();
  process.env.MONGO_DB_NAME = mongoTestDBName;
  app = require("../app");
  run();
});

after(() => {
  return mongoUnit.stop();
});

// Orders API tests

describe("Orders API tests:", () => {
  beforeEach(() => mongoUnit.load(testData.ordersCollection));

  afterEach(() => mongoUnit.drop());

  describe("POST /orders", () => {
    it("it should create a new order", (done) => {
      chai
        .request(app)
        .post("/api/orders")
        .send({
          clientId: "23321321421421",
          products: [
            { productId: "a123dasvfdacasds", quantity: 3 },
            { productId: "b123dasvfdacasds", quantity: 1 },
            { productId: "c123dasvfdacasds", quantity: 2 },
          ],
        })
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res.status).to.be.equal(200);
          expect(res.body).to.be.an("object");
          expect(res.body.clientId).to.be.equal("23321321421421");
          expect(res.body.products).to.be.an.string;
          expect(res.body.status).to.be.equal("WAITING");
          expect(res.body.totalPrice).to.be.equal("6");

          done();
        });
    });
  });
});

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

describe("Products API tests: ", () => {
  beforeEach(() => {
    dao.open();
    mongoUnit.load(testData.productsCollection);
    dao.createProductsTextSearchIndexes();
  });

  afterEach(() => {
    mongoUnit.drop();
    dao.close();
  });

  describe("GET /products", () => {
    it("it should retrieve the list of products based on the filters sent: CATEGORY", (done) => {
      chai
        .request(app)
        .get("/api/products?category=meat")
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res.status).to.be.equal(200);
          expect(res.body).to.be.an("array");
          expect(res.body.length).to.be.equal(2);
          expect(
            res.body.filter((product) => product.category == "meat").length
          ).to.be.equal(2);
          done();
        });
    });

    it("it should retrieve the list of products based on the filters sent: SEARCHSTRING", (done) => {
      chai
        .request(app)
        .get("/api/products?searchString=Nutella")
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

    it("it should retrieve the list of products based on the filters sent: ids", (done) => {
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

    it("it should retrieve the list of products based on the filters sent: CATEGORY, SEARCHSTRING", (done) => {
      chai
        .request(app)
        .get("/api/products?category=fruit&searchString=Italy")
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

    it("If no filter are passed then all the products should be retrieved", (done) => {
      chai
        .request(app)
        .get("/api/products")
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res.status).to.be.equal(200);
          expect(res.body).to.be.an("array");
          expect(res.body.length).to.be.equal(12);
          done();
        });
    });

    it("If there are no products with applied filters then it should return an empty array", (done) => {
      chai
        .request(app)
        .get("/api/products?category=meat&searchString=Do not find")
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res.status).to.be.equal(200);
          expect(res.body).to.be.an("array");
          expect(res.body.length).to.be.equal(0);
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

    it("It should return an error if the category passed is not valid: ", (done) => {
      chai
        .request(app)
        .get("/api/products?category=pizza")
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
        .get("/api/products")
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res.status).to.be.equal(500);
          done();
        });
    });
  });
});
