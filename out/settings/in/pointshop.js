"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dateformat_1 = __importDefault(require("dateformat"));
const config_1 = __importDefault(require("config"));
const uqs_1 = require("../uqs");
const promiseSize = config_1.default.get("promiseSize");
exports.PointProduct = {
    uq: uqs_1.uqs.jkPointShop,
    type: 'map',
    entity: 'PointProduct',
    mapper: {
        product: "ProductID@ProductX",
        arr1: {
            pack: "^PackageID@ProductX_PackX",
            point: "^Point",
            startDate: "^StartDate",
            endDate: "^EndDate"
        }
    },
    pull: `select top ${promiseSize} p.ID, p.PackageID, j.jkid as ProductID, p.Point, p.StartDate, p.EndDate, p.Comments from ProdData.dbo.Export_PointProduct p
    inner join zcl_mess.dbo.jkcat j on j.jkcat = p.PackageID where p.ID > @iMaxId order by ID`,
    pullWrite: async (joint, data) => {
        data["StartDate"] = data["StartDate"] && dateformat_1.default(data["StartDate"], "yyyy-mm-dd HH:MM:ss");
        data["EndDate"] = data["EndDate"] && dateformat_1.default(data["EndDate"], "yyyy-mm-dd HH:MM:ss");
        await joint.uqIn(exports.PointProduct, data);
        return true;
    }
};
//# sourceMappingURL=pointshop.js.map