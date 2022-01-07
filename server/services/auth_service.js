const dao = require("../dao/dao");

const session = require("express-session");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const saltRounds = 10;

const { UserRoles } = require("../models/user_roles");
const { ClientInfoResult } = require("../models/client_info_result");
const { EmployeeInfoResult } = require("../models/employee_info_result");
const { FarmerInfoResult } = require("../models/farmer_info_result");
const { ManagerInfoResult } = require("../models/manager_info_result");

function checkMatchingPasswords(inputPassword, userPassword) {
  return bcrypt.compare(inputPassword, userPassword);
}

exports.sessionSettings = session({
  secret: "bla bla bla",
  resave: false,
  saveUninitialized: false,
});

exports.passportStrategy = new LocalStrategy(async function (
  email,
  password,
  done
) {
  let user;
  try {
    user = await dao.getUserByEmail(email);
  } catch (err) {
    return done(true, null, {
      message: "Incorrect username and/or password.",
    });
  }

  let match = await checkMatchingPasswords(password, user.password);
  if (!match) {
    return done(true, null, {
      message: "Incorrect username and/or password.",
    });
  }

  let userResult;
  switch (user.role) {
    case UserRoles.CLIENT:
      userResult = ClientInfoResult.fromClientInfo(user);
      break;
    case UserRoles.EMPLOYEE:
      userResult = EmployeeInfoResult.fromEmployeeInfo(user);
      break;
    case UserRoles.MANAGER:
      userResult = ManagerInfoResult.fromManagerInfo(user);
      break;
    case UserRoles.FARMER:
    default:
      userResult = FarmerInfoResult.fromFarmerInfo(user);
      break;
  }

  return done(null, userResult);
});

exports.serializeUser = (user, done) => {
  return done(null, `${user.role}-${user.id}`);
};

exports.deserializeUser = async (id, done) => {
  const [userRole, userID] = id.split("-");

  let user;
  switch (userRole) {
    case UserRoles.CLIENT:
      user = ClientInfoResult.fromMongoJSON(await dao.getClientByID(userID));
      break;
    case UserRoles.MANAGER:
      user = ManagerInfoResult.fromMongoJSON(await dao.getManagerByID(userID));
      break;
    case UserRoles.EMPLOYEE:
      user = EmployeeInfoResult.fromMongoJSON(
        await dao.getEmployeeByID(userID)
      );
      break;
    case UserRoles.FARMER:
    default:
      user = FarmerInfoResult.fromMongoJSON(await dao.getFarmerByID(userID));
      break;
  }

  if (!user) {
    return done(err, null);
  }
  return done(null, user);
};

exports.hashPassword = (password) => {
  return bcrypt.hash(password, saltRounds);
};
