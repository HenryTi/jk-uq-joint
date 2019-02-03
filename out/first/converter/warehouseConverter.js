"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const usqOutRead_1 = require("./usqOutRead");
exports.readWarehouse = async (maxId) => {
    let sqlstring = `select top 1 CompanyID as ID, companyName as WarehouseName, companyAddr
        from dbs.dbo.Scompany where CompanyID > '${maxId}' order by CompanyId`;
    return await usqOutRead_1.read(sqlstring);
};
exports.readSalesRegionWarehouse = async (maxId) => {
    let sqlstring = `select top 1 ID, CompanyID as WarehouseID, Location as SalesRegionID, minDeliverTime, maxDeliverTime
        from dbs.dbo.CompanyLocation where ID > '${maxId}' order by Id`;
    return await usqOutRead_1.read(sqlstring);
};
//# sourceMappingURL=warehouseConverter.js.map