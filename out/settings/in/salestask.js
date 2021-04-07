"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Importcustomerdata = exports.JkTask = exports.JkTaskType = void 0;
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
        type: 'WorkTaskTypeID',
        deadline: 'RequireCompletionTime',
        createTime: 'CreateTime',
        completeTime: 'CompleteTime',
    },
    pull: `select   top ${promiseSize} a.ID, a.WorkTaskID, a.WorkTaskSource, a.CustomerID, a.EmployeeID, a.WorkTaskTypeID,
                    a.LinkObjectID, isnull(a.TimeLimit,0) as TimeLimit, a.RequireCompletionTime, a.CreateTime, a.CompleteTime
            from    ProdData.dbo.Export_WorkTask as a
            where a.ID > @iMaxId order by a.ID`,
    pullWrite: async (joint, uqin, data) => {
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
exports.Importcustomerdata = {
    uq: uqs_1.uqs.jkSalestask,
    type: 'map',
    entity: 'Importcustomerdata',
    mapper: {
        customer: 'customerid@Customer',
        arr1: {
            organization: '^organizationid@Organization',
            sales: '^webuser',
            note: '^note'
        }
    },
    pull: ` select top ${promiseSize} ID, customerid,organizationid,webuser,note
            from   ProdData.dbo.Export_Sales_Customer
            where  ID > @iMaxId order by ID`
};
//# sourceMappingURL=salestask.js.map