var dao = require("../dao/dao");
const { ManagerInfo } = require("../models/manager_info");

const { managerIDPathValidator } = require("./shared_validators");
exports.getManagerByIDValidatorChain = [managerIDPathValidator];

exports.getManagerByIDHandler = async function (req, res, next) {
  let result;
  try {
    result = await dao.getManagerByID(req.params.managerID);
  } catch (err) {
    console.error(`getManagerByID() -> couldn't retrieve manager: ${err}`);
    return res.status(500).end();
  }

  if (!result) {
    console.error(`getManagerByID() -> couldn't retrieve manager: not found`);
    return res.status(404).end();
  }

  return res.json(ManagerInfo.fromMongoJSON(result));
};
