"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const _ = __importStar(require("lodash"));
const dateformat_1 = __importDefault(require("dateformat"));
const uqs_1 = require("../uqs");
const config_1 = __importDefault(require("config"));
const promiseSize = config_1.default.get("promiseSize");
exports.JkTaskType = {
    uq: uqs_1.uqs.jkSalestask,
    type: 'tuid',
    entity: 'JkTaskType',
    key: 'WorkTaskTypeID',
    mapper: {
        $id: 'WorkTaskTypeID@JkTaskType',
        no: "WorkTaskTypeID",
        name: "name",
        TimeLimit: 'TimeLimit',
    },
    pull: `select top ${promiseSize} ID, WorkTaskTypeID, WorkTaskTypeName as name, TimeLimit
           from ProdData.dbo.Export_DicWorkTaskType where id > @iMaxId order by id`,
};
exports.JkTask = {
    uq: uqs_1.uqs.jkSalestask,
    type: 'tuid',
    entity: 'JkTask',
    key: 'WorkTaskID',
    mapper: {
        $id: 'WorkTaskID@JkTask',
        no: "WorkTaskID",
        description: 'LinkObjectID',
        customer: 'CustomerID@Customer',
        employee: "EmployeeID@Employee",
        sourceNo: 'LinkObjectID',
        priorty: 'TimeLimit',
        deadline: 'RequireCompletionTime',
        createTime: 'CreateTime',
        completeTime: 'CompleteTime',
    },
    pull: `select   top ${promiseSize} a.ID, a.WorkTaskID, a.WorkTaskSource, a.CustomerID, a.EmployeeID, 
                    a.LinkObjectID, isnull(a.TimeLimit,0) as TimeLimit, a.RequireCompletionTime, a.CreateTime, a.CompleteTime
            from    ProdData.dbo.Export_WorkTask as a
            where a.ID > @iMaxId order by a.ID`,
    pullWrite: async (joint, data) => {
        try {
            data["RequireCompletionTime"] = data["RequireCompletionTime"] && dateformat_1.default(data["RequireCompletionTime"], "yyyy-mm-dd"); //转换日期格式（存在日期才转换）
            data["CreateTime"] = data["CreateTime"] && dateformat_1.default(data["CreateTime"], "yyyy-mm-dd");
            await joint.uqIn(exports.JkTask, _.pick(data, ["ID", "WorkTaskID", "WorkTaskSource", "CustomerID", "EmployeeID", 'LinkObjectID', 'TimeLimit', 'RequireCompletionTime', 'CreateTime']));
            return true;
        }
        catch (error) {
            console.error(error);
            throw error;
        }
    },
};
//# sourceMappingURL=salestask.js.map