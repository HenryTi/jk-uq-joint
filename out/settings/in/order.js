"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderDetialEx = exports.OrderMainEx = void 0;
const uqs_1 = require("settings/uqs");
exports.OrderMainEx = {
    uq: uqs_1.uqs.jkOrder,
    type: 'ID',
    entity: 'OrderMainEx',
    key: 'id',
    mapper: {
        id: 'id',
    },
    /*
    pull: `select top ${promiseSize} ID, CustomerID, OrganizationID, Name, FirstName, LastName, XYZ, Gender, BirthDate, Tel1, Tel2, Mobile, Email as Email1, Email2
           , Fax1, Fax2, Zip, InvoiceTitle, TaxNo, RegisteredAddress, RegisteredTelephone, BankName, BankAccountNumber
           , SalesmanID, CustomerServiceStuffID, IsValid, SalesComanyID as SalesCompanyID, SalesRegionBelongsTo, CreateTime
           from ProdData.dbo.Export_Customer where ID > @iMaxId order by ID`,
    pullWrite: customerPullWrite,
    firstPullWrite: customerPullWrite,
    */
};
exports.OrderDetialEx = {
    uq: uqs_1.uqs.jkOrder,
    type: 'ID',
    entity: 'OrderDetailEx',
    key: 'id',
    mapper: {
        id: 'id',
    },
};
//# sourceMappingURL=order.js.map