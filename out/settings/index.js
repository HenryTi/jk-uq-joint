"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//import _out from "./out";
//import pull from "./pull";
const bus_1 = require("./bus");
const in_1 = __importDefault(require("./in"));
//import push from "./push";
exports.settings = {
    name: 'j&k_usq_joint',
    unit: 24,
    allowedIP: [
        '218.249.142.140',
        '211.5.7.60'
    ],
    usqIns: in_1.default,
    usqOuts: undefined,
    //out: _out,
    //pull: pull,
    //push: push,
    bus: bus_1.bus,
};
//# sourceMappingURL=index.js.map