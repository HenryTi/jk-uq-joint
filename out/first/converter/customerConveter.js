"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require(".");
exports.readCustomer = async (maxId) => {
    let sqlstring = `select top 1 CID as ID, UnitID as OrganizationID, Name, FirstName, LastName, Sex as Gender
        , convert(nvarchar(30), BirthDate, 121) as BirthDate
        , Tel1, Tel2, Mobile, Email, Email2, Fax1, Fax2, Zip, SaleComanyID as SalesCompanyID, saleRegionBelongsTo as SalesRegionBelongsTo
        , convert(nvarchar(30), creaDate, 121) as CreateTime
        from dbs.dbo.Customers where CID > '${maxId}' order by CID`;
    return await _1.read(sqlstring);
};
exports.readOrganization = async (maxId) => {
    let sqlstring = `select top 1 UnitID as ID, unitName as Name, convert(nvarchar(30), creaDate, 121) as CreateTime
        from dbs.dbo.CustUnits where UnitID > '${maxId}' order by UnitID`;
    return await _1.read(sqlstring);
};
exports.readCustomerConsigneeContact = async (maxId) => {
    let sqlstring = `select top 1 ID, CID as CustomerID, userName as Name, userUnit as OrganizationName, isnull(userMobile, '') as Mobile
        , email as Email, userZipCode as Zip, userAdd as Addr, isDefault
        from dbs.dbo.net_OrderBase_txt where ID > '${maxId}' order by ID`;
    return await _1.read(sqlstring);
};
exports.readCustomerInvoiceContact = async (maxId) => {
    let sqlstring = `select top 1 ID, CID as CustomerID, Name, Unit as OrganizationName, isnull(Mobile, '') as Mobile, Tel as Telephone
        , Email, Zip, Addr, isDefault
        from dbs.dbo.order_InvoiceInfo_txt where ID > '${maxId}' order by ID`;
    return await _1.read(sqlstring);
};
//# sourceMappingURL=customerConveter.js.map