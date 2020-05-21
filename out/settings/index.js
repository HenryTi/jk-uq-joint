"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = __importDefault(require("config"));
//import _out from "./out";
//import pull from "./pull";
const bus_1 = require("./bus");
const in_1 = __importDefault(require("./in"));
const uqOutRead_1 = require("../first/converter/uqOutRead");
//import push from "./push";
const uqInEntities = config_1.default.get("afterFirstEntities");
const uqBusSettings = config_1.default.get("uqBus");
const interval = config_1.default.get("interval");
exports.settings = {
    name: 'sales_uq_joint',
    unit: 24,
    allowedIP: [
        '218.249.142.140',
        '211.5.7.60'
    ],
    uqIns: in_1.default,
    uqOuts: undefined,
    uqInEntities: uqInEntities,
    uqBusSettings: uqBusSettings,
    scanInterval: interval,
    //out: _out,
    //pull: pull,
    //push: push,
    bus: bus_1.bus,
    // pullReadFromSql: uqPullRead
    pullReadFromSql: uqOutRead_1.uqOutRead
};
//# sourceMappingURL=index.js.map