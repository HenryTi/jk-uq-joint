import { uqs } from "settings/uqs";
import { UqInID } from "uq-joint";

export const OrderMainEx: UqInID = {
    uq: uqs.jkOrder,
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

export const OrderDetialEx: UqInID = {
    uq: uqs.jkOrder,
    type: 'ID',
    entity: 'OrderDetailEx',
    key: 'id',
    mapper: {
        id: 'id',
    },
};
