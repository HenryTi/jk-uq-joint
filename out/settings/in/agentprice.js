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
exports.JKAgentPrice = {
    uq: uqs_1.uqs.jkProduct,
    type: 'tuid',
    entity: 'AgentPrice',
    key: 'ID',
    mapper: {
        salesRegion: "SalesRegion",
        product: 'ProductId@ProductX',
        pack: 'PackageId',
        expireDate: 'Expiredate',
        discountinued: 'Discontinued',
        agentPrice: 'AgencyPrice',
    },
    pull: `select   top ${promiseSize}  ID, SalesRegion, ProductId, PackageId, AgencyPrice, Expiredate, Discontinued
            from    ProdData.dbo.Export_ProductAgencyPrice as a
            where  ID > @iMaxId order by  ID`,
    pullWrite: async (joint, data) => {
        try {
            data["RequireCompletionTime"] = data["RequireCompletionTime"] && dateformat_1.default(data["RequireCompletionTime"], "yyyy-mm-dd");
            data["CreateTime"] = data["CreateTime"] && dateformat_1.default(data["CreateTime"], "yyyy-mm-dd");
            await joint.uqIn(exports.JKAgentPrice, _.pick(data, ["ID", "SalesRegion", "WorkTaskSource", "CustomerID", "EmployeeID", 'LinkObjectID', 'TimeLimit', 'RequireCompletionTime', 'CreateTime']));
            return true;
        }
        catch (error) {
            console.error(error);
            throw error;
        }
    },
};
//# sourceMappingURL=agentprice.js.map