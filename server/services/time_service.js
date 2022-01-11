"use strict";

const dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc");
dayjs.extend(utc);

exports.getNowDate = () => dayjs().utc();
