exports.loginHandler = (passport) =>
  async function (req, res, next) {
    passport.authenticate("local", (err, user, info) => {
      if (err) {
        console.error(
          `UserLogin() -> error during user authentication: ${info}`
        );
        return res.status(401).json(info);
      }

      user["password"] = undefined;

      req.login(user, (err) => {
        if (err) {
          console.error(`UserLogin() -> error during user login: ${err}`);
          return res.status(401).json(info);
        }

        return res.json(req.user);
      });
    })(req, res, next);
  };

exports.logoutHandler = async function (req, res, next) {
  req.logout();
  res.status(204).end();
};

exports.getCurrentUserHandler = async function (req, res, next) {
  if (req.isAuthenticated()) {
    return res.status(200).json(req.user);
  }
  return res.status(204).end();
};
