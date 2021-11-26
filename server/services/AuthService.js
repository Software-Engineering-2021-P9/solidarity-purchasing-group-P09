const dao = require("../dao/dao");
const ClientInfo = require("../models/ClientInfo");

const UserRoles = {
  CLIENT: "client",
  EMPLOYEE: "employee",
  FARMER: "farmer",
};
export { UserRoles };

function checkMatchingPasswords(inputPassword, userPassword) {
  return bcrypt.compare(password, user.password);
}

exports.passportStrategy = new LocalStrategy(function (email, password, done) {
  let user = await dao.getUserByEmail(email);
  if (!user) {
    return done(null, false, {
      message: "Incorrect username and/or password.",
    });
  }

  let match = checkMatchingPasswords(password, user.password);
  if (!match) {
    return done(null, false, {
      message: "Incorrect username and/or password.",
    });
  }

  return done(null, user);
});

exports.getUserRole = (user) => {
  if (user instanceof ClientInfo) {
    return "client";
  }
};

exports.serializeUser = (user, done) => {
  done(null, user._id);
};

exports.deserializeUser = (id, done) => {
  dao
    .getUserById(id)
    .then((user) => {
      done(null, user);
    })
    .catch((err) => {
      done(err, null);
    });
};
