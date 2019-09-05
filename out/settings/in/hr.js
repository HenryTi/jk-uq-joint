"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const uqs_1 = require("../uqs");
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
            data["CreateTime"] = data["CreateTime"].getTime(); // dateFormat(data["CreateTime"], 'yyyy-mm-dd HH:MM:ss');
            await joint.uqIn(exports.Employee, data);
            return true;
        }
        catch (error) {
            console.error(error);
            throw error;
        }
    },
};
//# sourceMappingURL=hr.js.map