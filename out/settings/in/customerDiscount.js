"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dateformat_1 = __importDefault(require("dateformat"));
const uqs_1 = require("../uqs");
const tools_1 = require("../../mssql/tools");
const uqOutRead_1 = require("../../first/converter/uqOutRead");
const config_1 = __importDefault(require("config"));
const promiseSize = config_1.default.get("promiseSize");
exports.CustomerDiscount = {
    uq: uqs_1.uqs.jkCustomerDiscount,
    type: 'map',
    entity: 'CustomerDiscount',
    mapper: {
        customer: 'CustomerID@Customer',
        arr1: {
            brand: "^BrandID@Brand",
            discount: "^Discount",
            startDate: "^StartDate",
            endDate: "^EndDate",
        }
    },
    pull: async (joint, uqIn, queue) => {
        let sql = `select top ${promiseSize} md.ID, a.CID as CustomerID, md.Manu as BrandID, md.DiscountValue as Discount, a.StartDate, a.EndDate
        from ProdData.dbo.Export_AgreementManuDiscount md
        inner join dbs.dbo.Agreement a on md.AgreementID = a.AgreementID
        where md.ID > @iMaxId and a.objType = 'C' order by md.Id`;
        try {
            let ret = await uqOutRead_1.uqOutRead(sql, queue);
            if (ret !== undefined) {
                let { data } = ret;
                data.map(e => {
                    e["StartDate"] = e["StartDate"].getTime();
                    e["EndDate"] = e["EndDate"].getTime();
                });
                return ret;
            }
        }
        catch (error) {
            console.error(error);
            throw error;
        }
    }
};
exports.OrganizationDiscount = {
    uq: uqs_1.uqs.jkCustomerDiscount,
    type: 'map',
    entity: 'OrganizationDiscount',
    mapper: {
        organization: 'OrganizationID@Organization',
        arr1: {
            brand: "^BrandID@Brand",
            discount: "^Discount",
            startDate: "^StartDate",
            endDate: "^EndDate",
        }
    },
    pull: async (joint, uqIn, queue) => {
        let sql = `select top ${promiseSize} md.ID, a.CID as OrganizationID, md.Manu as BrandID, md.DiscountValue as Discount, a.StartDate, a.EndDate
        from ProdData.dbo.Export_AgreementManuDiscount md
        inner join dbs.dbo.Agreement a on md.AgreementID = a.AgreementID
        where md.ID > @iMaxId and a.objType = 'U' order by md.Id`;
        try {
            let ret = await uqOutRead_1.uqOutRead(sql, queue);
            if (ret !== undefined) {
                let { data } = ret;
                data.map(e => {
                    e["StartDate"] = e["StartDate"].getTime();
                    e["EndDate"] = e["EndDate"].getTime();
                });
                return ret;
            }
        }
        catch (error) {
            console.error(error);
            throw error;
        }
    }
};
exports.Agreement = {
    uq: uqs_1.uqs.jkCustomerDiscount,
    type: 'map',
    entity: 'Agreement',
    mapper: {
        organization: 'OrganizationID@Organization',
        startDate: 'StartDate',
        endDate: 'EndDate',
    },
    pull: `select top ${promiseSize} ID, AgreementID, CID, ObjType, StartDate, EndDate from ProdData.dbo.Export_Agreement where ID > @iMaxId and objType in ( 'C', 'U' ) order by ID`,
    pullWrite: async (joint, data) => {
        let sql = `select a.CID, md.Manu as BrandID, md.DiscountValue as Discount, a.StartDate, a.EndDate
                from dbs.dbo.Agreement a
                inner join dbs.dbo.AgreementManuDiscount md on md.AgreementID = a.AgreementID
                where a.AgreementID = @agreementID`;
        let result = undefined;
        try {
            result = await tools_1.execSql(sql, [{ 'name': 'agreementID', 'value': data['AgreementID'] }]);
        }
        catch (error) {
            console.error(error);
            throw error;
        }
        if (result !== undefined) {
            let { recordset } = result;
            for (var i = 0; i < recordset.length; i++) {
                let row = recordset[i];
                let { CID, BrandID, Discount, StartDate, EndDate } = row;
                StartDate = StartDate && dateformat_1.default(StartDate, "yyyy-mm-dd HH:MM:ss");
                EndDate = EndDate && dateformat_1.default(EndDate, "yyyy-mm-dd HH:MM:ss");
                try {
                    if (data['ObjType'] === 'C') {
                        await joint.uqIn(exports.CustomerDiscount, {
                            "CustomerID": CID,
                            "BrandID": BrandID, 'Discount': Discount, "StartDate": StartDate, "EndDate": EndDate
                        });
                    }
                    if (data['ObjType'] === 'U') {
                        await joint.uqIn(exports.OrganizationDiscount, {
                            "OrganizationID": CID,
                            "BrandID": BrandID, 'Discount': Discount, "StartDate": StartDate, "EndDate": EndDate
                        });
                    }
                }
                catch (error) {
                    console.error(error);
                    throw error;
                }
            }
        }
        return true;
    }
};
//# sourceMappingURL=customerDiscount.js.map