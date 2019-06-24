import * as _ from 'lodash';
import { UqInTuid, UqInMap, UqInTuidArr, Joint } from "../../uq-joint";
import { uqs } from "../uqs";
import { customerPullWrite, customerFirstPullWrite, consigneeContactPullWrite } from '../../first/converter/customerPullWrite';

export const Customer: UqInTuid = {
    uq: uqs.jkCustomer,
    type: 'tuid',
    entity: 'Customer',
    key: 'CustomerID',
    mapper: {
        $id: 'CustomerID@Customer',
        no: "CustomerID",
        name: 'Name',
        firstName: 'FirstName',
        lastName: 'LastName',
        gender: 'Gender',
        salutation: 'Salutation',
        birthDay: 'BirthDate',
        createTime: 'CreateTime',
        isValid: 'IsValid',
        XYZ: 'XYZ',
    },
    pull: `select ID, CustomerID, OrganizationID, Name, FirstName, LastName, XYZ, Gender, BirthDate, Tel1, Tel2, Mobile, Email, Email2
           , Fax1, Fax2, Zip, InvoiceTitle, TaxNo, RegisteredAddress, RegisteredTelephone, BankName, BankAccountNumber
           , SalesmanID, CustomerServiceStuffID, IsValid, SalesCompanyID, SalesRegionBelongsTo, CreateTime
           from ProdData.dbo.Export_Customer where ID > @iMaxId order by ID`,
    pullWrite: customerPullWrite,
    firstPullWrite: customerFirstPullWrite,
};

export const Organization: UqInTuid = {
    uq: uqs.jkCustomer,
    type: 'tuid',
    entity: 'Organization',
    key: 'OrgnizationID',
    mapper: {
        $id: 'OrgnizationID@Organization',
        no: 'OrgnizationID',
        name: 'Name',
        createTime: 'CreateTime',
    },
    pull: `select ID, OrgnizationID, UnitName as Name, CreateTime
           from ProdData.dbo.Export_Orgnization where ID > @iMaxId order by ID`,
    pullWrite: async (joint: Joint, data: any) => {
        try {
            await joint.uqIn(Organization, data);
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    }
};

export const OrganizationCustomer: UqInMap = {
    uq: uqs.jkCustomer,
    type: 'map',
    entity: 'OrganizationCustomer',
    mapper: {
        organization: "OrganizationID@Organization",
        arr1: {
            customer: '^CustomerID@Customer',
        }
    }
};

export const CustomerContact: UqInTuidArr = {
    uq: uqs.jkCustomer,
    type: 'tuid-arr',
    entity: 'Customer_Contact',
    owner: 'CustomerID',
    key: 'ID',
    mapper: {
        $id: 'ID@Customer_Contact',
        type: 'TypeID',
        content: 'Content',
    }
};

export const CustomerContacts: UqInMap = {
    uq: uqs.jkCustomer,
    type: 'map',
    entity: 'CustomerContacts',
    mapper: {
        customer: 'CustomerID@Customer',
        arr1: {
            contact: '^ID@Contact',
        }
    }
};

export const Contact: UqInTuid = {
    uq: uqs.jkCustomer,
    type: 'tuid',
    entity: 'Contact',
    key: 'ID',
    mapper: {
        $id: 'ID@Contact',
        name: 'Name',
        organizationName: 'OrganizationName',
        mobile: 'Mobile',
        telephone: 'Telephone',
        email: 'Email',
        addressString: 'Addr',
        address: "AddressID@Address",
    },
    pullWrite: consigneeContactPullWrite,
};

export const InvoiceInfo: UqInTuid = {
    uq: uqs.jkCustomer,
    type: 'tuid',
    entity: 'InvoiceInfo',
    key: 'CustomerID',  // CustomerID作为InvoiceInfo的ID
    mapper: {
        $id: 'CustomerID@InvoiceInfo',
        title: 'InvoiceTitle',
        address: 'RegisteredAddress',
        telephone: 'RegisteredTelephone',
        bank: 'BankName',
        accountNo: 'BankAccountNumber',
    },
};

export const CustomerSetting: UqInMap = {
    uq: uqs.jkCustomer,
    type: 'map',
    entity: 'CustomerSetting',
    mapper: {
        customer: 'CustomerID@Customer',
        arr1: {
            shippingContact: '^ShippingContactID@Contact',
            invoiceContact: '^InvoiceContactID@Contact',
            invoiceType: '^InvoiceTypeID@InvoiceType',
            invoiceInfo: '^InvoiceInfoID@InvoiceInfo',
        }
    }
};

export const CustomerHandler: UqInMap = {
    uq: uqs.jkCustomer,
    type: 'map',
    entity: 'CustomerHandler',
    mapper: {
        customer: 'CustomerID@Customer',
        salesman: 'SalesmanID@Employee',
        arr1: {
            customerServiceStuff: '^CustomerServiceStuffID@Employee',
        }
    }
};