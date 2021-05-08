"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Employee = void 0;
const timeAsQueue_1 = require("../../settings/timeAsQueue");
const logger_1 = require("../../tools/logger");
const uqs_1 = require("../uqs");
exports.Employee = {
    uq: uqs_1.uqs.jkHr,
    type: 'tuid',
    entity: 'Employee',
    key: 'EPID',
    mapper: {
        $id: 'EPID@Employee',
        no: "EPID",
        name: "ChineseName",
        firstName: "EpName1",
        lastName: "EpName2",
        title: "Title",
        status: "Status",
        CreateTime: "CreateTime",
    },
    pull: pullEmployee,
    pullWrite: async (joint, uqIn, data) => {
        try {
            data["CreateTime"] = data["CreateTime"].getTime() / 1000; // dateFormat(data["CreateTime"], 'yyyy-mm-dd HH:MM:ss');
            await joint.uqIn(exports.Employee, data);
            return true;
        }
        catch (error) {
            console.error(error);
            throw error;
        }
    },
};
pullEmployee.lastLength = 0;
async function pullEmployee(joint, uqIn, queue) {
    let { lastLength } = pullEmployee;
    let sql = `select top --topn-- DATEDIFF(s, '1970-01-01', Update__time) as ID, EPID, ChineseName, EpName1, EpName2, Title, Status, Creadate as CreateTime
            from dbs.dbo.Employee 
            where Update__Time >= DATEADD(s, @iMaxId, '1970-01-01')
            order by Update__time`;
    try {
        let ret = await timeAsQueue_1.timeAsQueue(sql, queue, lastLength);
        if (ret !== undefined) {
            pullEmployee.lastLength = ret.lastLength;
            return ret.ret;
        }
    }
    catch (error) {
        logger_1.logger.error(error);
        throw error;
    }
}
//# sourceMappingURL=hr.js.map