var dao = require("../dao/dao");

const { telegramChatIDValidator } = require("./shared_validators");

exports.addTelegramUsersValidatorChain = [telegramChatIDValidator];

exports.getTelegramUsersHandler = async function (req, res, next) {
  let telegramUsers;
  try {
    telegramUsers = await dao.getTelegramUsers();
  } catch (err) {
    console.error(
      `getTelegramUsersHandler() -> couldn't retrieve users: ${err}`
    );
    return res.status(500).end();
  }

  return res.json(telegramUsers);
};

exports.addTelegramUsersHandler = async function (req, res, next) {
  try {
    telegramUser = await dao.addTelegramUsers(parseInt(req.body.chatID));
  } catch (err) {
    console.error(`addTelegramUsersHandler() -> couldn't add the user: ${err}`);
    return res.status(500).end();
  }
  return res.json(telegramUser);
};
