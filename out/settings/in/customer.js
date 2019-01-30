"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const usqs_1 = require("../usqs");
exports.Customer = {
    usq: usqs_1.usqs.jkCustomer,
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
    }
};
exports.Organization = {
    usq: usqs_1.usqs.jkCustomer,
    type: 'tuid',
    entity: 'Organization',
    key: 'ID',
    mapper: {
        $id: 'ID@Organization',
        no: 'ID',
        name: 'Name',
        createTime: 'CreateTime',
    }
};
exports.OrganizationCustomer = {
    usq: usqs_1.usqs.jkCustomer,
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
    usq: usqs_1.usqs.jkCustomer,
    type: 'tuid-arr',
    entity: 'Customer.Contact',
    owner: 'CustomerID',
    key: 'ID',
    mapper: {
        $id: 'ID@CustomerContact',
        type: 'TypeID',
        content: 'Content',
    }
};
/*
export const CustomerConsigneeContact: UsqInMap = {
    usq: usqs.jkCustomer,
    type: 'map',
    entity: 'CustomerConsigneeContact',
    mapper: {
        customer: 'CustomerID@Customer',
        name: 'Name',
        organizationName: 'OrganizationName',
        mobile: 'Mobile',
        telephone: 'Telephone',
        email: 'Email',
        addressString: 'Addr',
        address: "AddressID@Address",
        isDefault: 'isDefault',
    }
};

export const CustomerInvoiceContact: UsqInMap = {
    usq: usqs.jkCustomer,
    type: 'map',
    entity: 'CustomerInvoiceContact',
    mapper: {
        customer: 'CustomerID@Customer',
        name: 'Name',
        organizationName: 'OrganizationName',
        mobile: 'Mobile',
        telephone: 'Telephone',
        email: 'Email',
        addressString: 'Addr',
        address: "AddressID@Address",
        isDefault: 'isDefault',
    }
};
*/
exports.CustomerContacts = {
    usq: usqs_1.usqs.jkCustomer,
    type: 'map',
    entity: 'CustomerContacts',
    mapper: {
        customer: 'CustomerID@Customer',
        arr1: {
            contact: '^ID@Contact',
        }
    }
};
/*
export const CustomerInvoiceContact: UsqInMap = {
    usq: usqs.jkCustomer,
    type: 'map',
    entity: 'CustomerInvoiceContact',
    mapper: {
        customer: 'CustomerID@Customer',
        arr1: {
            contact: '^ID@Contact',
        }
    }
};
*/
exports.Contact = {
    usq: usqs_1.usqs.jkCustomer,
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
    }
};
//# sourceMappingURL=customer.js.map