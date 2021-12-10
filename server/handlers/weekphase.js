var weekphaseService = require("../services/weekphase_service/weekphase_service");
const { weekphaseIDBodyValidator } = require("./shared_validators");

exports.getCurrentWeekphaseHandler = async function (req, res, next) {
  return res.json({ currentWeekphase: weekphaseService.getCurrentWeekphase() });
};

exports.setWeekphaseOverrideValidatorChain = [weekphaseIDBodyValidator];

exports.setWeekphaseOverrideHandler = async function (req, res, next) {
  try {
    weekphaseService.setWeekphaseOverride(req.body.weekphaseID?.toString());
  } catch (err) {
    console.error(
      `SetWeekphaseOverride() -> failed with error: ${err.message}`
    );
    return res.status(400).end();
  }
  return res.status(204).end();
};
