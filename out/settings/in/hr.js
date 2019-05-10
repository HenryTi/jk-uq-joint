"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const uqs_1 = require("../uqs");
const dateformat_1 = __importDefault(require("dateformat"));
exports.Employee = {
    uq: uqs_1.uqs.jkHr,
    type: 'tuid',
    entity: 'Employee',
    key: 'ID',
    mapper: {
        $id: 'ID@Employee',
        no: "ID",
        name: "ChineseName",
        firstName: "EpName1",
        lastName: "EpName2",
        title: "Title",
        status: "Status",
        CreateTime: "CreateTime",
    },
    pullWrite: async (joint, data) => {
        try {
            data["CreateTime"] = dateformat_1.default(data["CreateTime"], 'yyyy-mm-dd HH:MM:ss');
            await joint.uqIn(exports.Employee, data);
            return true;
        }
        catch (error) {
            console.log(error);
            return false;
        }
    },
};
//# sourceMappingURL=hr.js.map