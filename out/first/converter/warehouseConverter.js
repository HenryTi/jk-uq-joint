"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const uqOutRead_1 = require("./uqOutRead");
exports.readWarehouse = async (maxId) => {
    let sqlstring = `select top 1 CompanyID as ID, companyName as WarehouseName, companyAddr
        from dbs.dbo.Scompany where CompanyID > '${maxId}' order by CompanyId`;
    return await uqOutRead_1.read(sqlstring);
};
exports.readSalesRegionWarehouse = async (maxId) => {
    let sqlstring = `select top 1 ID, CompanyID as WarehouseID, Location as SalesRegionID, minDeliverTime, maxDeliverTime
        from dbs.dbo.CompanyLocation where ID > '${maxId}' order by Id`;
    return await uqOutRead_1.read(sqlstring);
};
//# sourceMappingURL=warehouseConverter.js.map