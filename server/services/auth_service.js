const dao = require("../dao/dao");

const session = require("express-session");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");

const { ClientInfo } = require("../models/client_info");
const { EmployeeInfo } = require("../models/employee_info");
const { FarmerInfo } = require("../models/farmer_info");
const { UserRoles } = require("../models/user_roles");

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

  return done(null, user);
});

exports.serializeUser = (user, done) => {
  return done(null, `${user.role}-${user.id}`);
};

exports.deserializeUser = async (id, done) => {
  const [userRole, userID] = id.split("-");

  let user;
  switch (userRole) {
    case UserRoles.CLIENT:
      user = ClientInfo.fromMongoJSON(await dao.getClientByID(userID));
      break;
    case UserRoles.EMPLOYEE:
      user = EmployeeInfo.fromMongoJSON(await dao.getEmployeeByID(userID));
      break;
    case UserRoles.FARMER:
    default:
      user = FarmerInfo.fromMongoJSON(await dao.getFarmerByID(userID));
      break;
  }

  if (!user) {
    return done(err, null);
  }
  user["password"] = undefined;
  return done(null, user);
};
