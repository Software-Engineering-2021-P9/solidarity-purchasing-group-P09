const chai = require("chai");
const expect = chai.expect;
const chaiHttp = require("chai-http");
chai.use(chaiHttp);
var {
  weekphaseEightHandler,
} = require("../services/weekphase_service/weekphase_config");
const sinon = require("sinon");
// -------------
// STUBS SECTION
// -------------
// Override time function to make it fixed at a specific date.
const timeService = require("../services/time_service");
const dayjs = require("dayjs");

sinon
  .stub(timeService, "getNowDate")
  .returns(dayjs("2021-12-05T12:00:00.000Z"));

var weekphaseService = require("../services/weekphase_service/weekphase_service");

// Weekphases API tests
exports.tests = (app, mongoUnit, testData, dao) => {
  describe("Weekphases Cron tests:", () => {
    beforeEach(() => {
      weekphaseService.init();
    });

    afterEach(() => {
      weekphaseService.close();
    });

    it("it should run after initialization", (done) => {
      expect(weekphaseService.isCronRunning()).to.be.true;
      done();
    });

    it("it should not run after deinitialization", (done) => {
      weekphaseService.close();
      expect(weekphaseService.isCronRunning()).to.be.false;
      done();
    });

    it("it should not run after weekphase override", (done) => {
      weekphaseService.setWeekphaseOverride("weekphase-1");
      expect(weekphaseService.isCronRunning()).to.be.false;
      weekphaseService.setWeekphaseOverride(null);
      done();
    });

    it("it should run after weekphase override is removed", (done) => {
      weekphaseService.setWeekphaseOverride("weekphase-1");
      weekphaseService.setWeekphaseOverride(null);
      expect(weekphaseService.isCronRunning()).to.be.true;
      done();
    });

    it("it should run after weekphase override is removed", (done) => {
      weekphaseService.setWeekphaseOverride("weekphase-1");
      weekphaseService.setWeekphaseOverride(null);
      expect(weekphaseService.isCronRunning()).to.be.true;
      done();
    });
  });

  describe("Weekphases middleware tests:", () => {
    let nextCalled = false;
    let error = false;
    let mockRes = {
      status: () => {
        error = true;
        return mockRes;
      },
      json: () => {},
    };
    let mockNext = () => (nextCalled = true);

    beforeEach(() => {
      weekphaseService.init();
      nextCalled = false;
      error = false;
    });

    afterEach(() => {
      weekphaseService.close();
    });

    it("it should success if current weekphase is within allowed ones", (done) => {
      const middleware = weekphaseService.checkWeekphaseMiddleware([
        "weekphase-1",
        "weekphase-2",
      ]);
      middleware({}, mockRes, mockNext);

      expect(nextCalled).to.be.true;
      expect(error).to.be.false;
      done();
    });

    it("it should fail if the weekphase is not within allowed ones", (done) => {
      const middleware = weekphaseService.checkWeekphaseMiddleware([
        "weekphase-5",
        "weekphase-2",
      ]);
      middleware({}, mockRes, mockNext);

      expect(nextCalled).to.be.false;
      expect(error).to.be.true;
      done();
    });
  });

  describe("Weekphases API tests:", () => {
    beforeEach(() => {
      weekphaseService.init();
    });

    afterEach(() => {
      weekphaseService.close();
    });

    describe("GET /weekphases/current", () => {
      it("it should retrieve the current weekphase", (done) => {
        chai
          .request(app)
          .get("/api/weekphases/current")
          .end((err, res) => {
            expect(err).to.be.null;
            expect(res.status).to.be.equal(200);
            expect(res.body).to.be.an("object");
            expect(res.body.currentWeekphase).to.be.equal("weekphase-1");
            done();
          });
      });
    });

    describe("PATCH /testing/weekphases/current", () => {
      it("it should set the override weekphase", (done) => {
        chai
          .request(app)
          .patch("/api/testing/weekphases/current")
          .send({ weekphaseID: "weekphase-4" })
          .end((err, res) => {
            expect(err).to.be.null;
            expect(res.status).to.be.equal(204);
            expect(weekphaseService.getCurrentWeekphase()).to.be.equal(
              "weekphase-4"
            );
            done();
          });
      });

      it("it should fail if the passed weekphase doesn't exist", (done) => {
        chai
          .request(app)
          .patch("/api/testing/weekphases/current")
          .send({ weekphaseID: "weekphase-finta" })
          .end((err, res) => {
            expect(err).to.be.null;
            expect(res.status).to.be.equal(400);
            done();
          });
      });

      it("it should success if the passed weekphase is the same already set", (done) => {
        chai
          .request(app)
          .patch("/api/testing/weekphases/current")
          .send({ weekphaseID: "weekphase-1" })
          .end();
        chai
          .request(app)
          .patch("/api/testing/weekphases/current")
          .send({ weekphaseID: "weekphase-1" })
          .end((err, res) => {
            expect(err).to.be.null;
            expect(res.status).to.be.equal(204);
            done();
          });
      });

      it("it should remove the override if null is passed", (done) => {
        chai
          .request(app)
          .patch("/api/testing/weekphases/current")
          .send({ weekphaseID: null })
          .end((err, res) => {
            expect(err).to.be.null;
            expect(res.status).to.be.equal(204);
            done();
          });
      });
    });
  });

  describe("Weekphase handlers tests:", () => {
    describe("weekphaseEightHandler test", () => {
      beforeEach(() => {
        dao.open();
        mongoUnit.load(testData.ordersCollection3);
      });

      afterEach(() => {
        mongoUnit.drop();
        dao.close();
      });

      it("It should set to unretrieved only the order with id: 6187c957b288576ca26f8251", (done) => {
        weekphaseEightHandler({
          currentWeekClient: weekphaseService.getCurrentWeekClient(),
        }).then(() =>
          dao.getOrdersByClientID("6187c957b288576ca26f8257").then((orders) => {
            expect(orders.length).to.be.equal(6);
            let updatedOrder = orders.find(
              (el) => el._id.toString() == "6187c957b288576ca26f8251"
            );
            expect(updatedOrder.status).to.be.equal("unretrieved");
            done();
          })
        );
      });
    });
  });
};
