import { UqInTuid, UqInMap, UqInTuidArr } from "../../uq-joint";
import { uqs } from "../uqs";

export const Customer: UqInTuid = {
    uq: uqs.jkCustomer,
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
        // createTime: 'CreateTime',
    }
};

export const Organization: UqInTuid = {
    uq: uqs.jkCustomer,
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

export const OrganizationCustomer: UqInMap = {
    uq: uqs.jkCustomer,
    type: 'map',
    entity: 'OrganizationCustomer',
    mapper: {
        organization: "OrganizationID@Organization",
        arr1: {
            customer: '^ID@Customer',
        }
    }
};

export const CustomerContact: UqInTuidArr = {
    uq: uqs.jkCustomer,
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
export const CustomerConsigneeContact: UqInMap = {
    uq: uqs.jkCustomer,
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

export const CustomerInvoiceContact: UqInMap = {
    uq: uqs.jkCustomer,
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

/*
export const CustomerInvoiceContact: UqInMap = {
    uq: uqs.jkCustomer,
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
    }
};