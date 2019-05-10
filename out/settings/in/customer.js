"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const uqs_1 = require("../uqs");
const customerPullWrite_1 = require("../../first/converter/customerPullWrite");
exports.Customer = {
    uq: uqs_1.uqs.jkCustomer,
    type: 'tuid',
    entity: 'Customer',
    key: 'ID',
    mapper: {
        $id: 'ID@Customer',
        no: "ID",
        name: 'Name',
        firstName: 'FirstName',
        lastName: 'LastName',
        gender: 'Gender',
        salutation: 'Salutation',
        birthDay: 'BirthDate',
        createTime: 'CreateTime',
        isValid: 'IsValid',
    },
    pullWrite: customerPullWrite_1.customerPullWrite,
    firstPullWrite: customerPullWrite_1.customerFirstPullWrite,
};
exports.Organization = {
    uq: uqs_1.uqs.jkCustomer,
    type: 'tuid',
    entity: 'Organization',
    key: 'ID',
    mapper: {
        $id: 'ID@Organization',
        no: 'ID',
        name: 'Name',
        createTime: 'CreateTime',
    },
    pullWrite: async (joint, data) => {
        try {
            await joint.uqIn(exports.Organization, data);
            return true;
        }
        catch (error) {
            console.log(error);
            return false;
        }
    }
};
exports.OrganizationCustomer = {
    uq: uqs_1.uqs.jkCustomer,
    type: 'map',
    entity: 'OrganizationCustomer',
    mapper: {
        organization: "OrganizationID@Organization",
        arr1: {
            customer: '^ID@Customer',
        }
    }
};
exports.CustomerContact = {
    uq: uqs_1.uqs.jkCustomer,
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
exports.CustomerContacts = {
    uq: uqs_1.uqs.jkCustomer,
    type: 'map',
    entity: 'CustomerContacts',
    mapper: {
        customer: 'CustomerID@Customer',
        arr1: {
            contact: '^ID@Contact',
        }
    }
};
exports.Contact = {
    uq: uqs_1.uqs.jkCustomer,
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
    pullWrite: customerPullWrite_1.consigneeContactPullWrite,
};
exports.InvoiceInfo = {
    uq: uqs_1.uqs.jkCustomer,
    type: 'tuid',
    entity: 'InvoiceInfo',
    key: 'ID',
    mapper: {
        $id: 'ID@InvoiceInfo',
        title: 'InvoiceTitle',
        taxNo: 'TaxNo',
        address: 'RegisteredAddress',
        telephone: 'RegisteredTelephone',
        bank: 'BankName',
        accountNo: 'BankAccountNumber',
    },
};
exports.CustomerSetting = {
    uq: uqs_1.uqs.jkCustomer,
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
exports.CustomerHandler = {
    uq: uqs_1.uqs.jkCustomer,
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
//# sourceMappingURL=customer.js.map