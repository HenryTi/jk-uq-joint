"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const _ = __importStar(require("lodash"));
const uqs_1 = require("../uqs");
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
    },
    pullWrite: async (joint, data) => {
        try {
            // data["CreateTime"] = data["CreateTime"] && data["CreateTime"].getTime();
            await joint.uqIn(exports.Customer, _.pick(data, ["ID", "Name", "FirstName", "LastName", "Gender", "BirthDate", 'CreateTime']));
            let promises = [];
            promises.push(joint.uqIn(exports.OrganizationCustomer, _.pick(data, ["ID", "OrganizationID"])));
            let customerId = data["ID"];
            let props = [
                { name: 'Tel1', type: 'tel' },
                { name: 'Tel2', type: 'tel' },
                { name: 'Mobile', type: 'mobile' },
                { name: 'Email1', type: 'email' },
                { name: 'Email2', type: 'email' },
                { name: 'Fax1', type: 'fax' },
                { name: 'Fax2', type: 'fax' },
            ];
            for (let prop of props) {
                let { name, type } = prop;
                let v = data[name];
                if (!v)
                    continue;
                promises.push(joint.uqIn(exports.CustomerContact, { 'ID': customerId + '-' + v, 'CustomerID': customerId, 'TypeID': type, 'Content': v }));
            }
            await Promise.all(promises);
            return true;
        }
        catch (error) {
            console.error(error);
            return false;
        }
    }
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
            // data["CreateTime"] = data["CreateTime"] && data["CreateTime"].getTime();
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
    entity: 'Customer.Contact',
    owner: 'CustomerID',
    key: 'ID',
    mapper: {
        $id: 'ID@Customer.Contact',
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
    pullWrite: async (joint, data) => {
        try {
            await joint.uqIn(exports.Contact, data);
            await joint.uqIn(exports.CustomerContacts, _.pick(data, ["ID", "CustomerID"]));
            return true;
        }
        catch (error) {
            console.log(error);
            return false;
        }
    }
};
//# sourceMappingURL=customer.js.map