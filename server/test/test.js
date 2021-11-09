let chai = require("chai");
let expect = chai.expect;
let chaiHttp = require("chai-http");

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

// Employees API tests
describe("Employees API tests:", () => {
  beforeEach(() => mongoUnit.load(testData.employeesCollection));

  afterEach(() => mongoUnit.drop());

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
  });
});
