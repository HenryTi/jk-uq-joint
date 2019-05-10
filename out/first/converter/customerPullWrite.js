"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = __importDefault(require("lodash"));
const customer_1 = require("../../settings/in/customer");
const tools_1 = require("../../mssql/tools");
async function customerPullWrite(joint, data) {
    try {
        await joint.uqIn(customer_1.Customer, lodash_1.default.pick(data, ["ID", "Name", "FirstName", "LastName", "Gender", "BirthDate", 'CreateTime', 'IsValid']));
        let promises = [];
        promises.push(joint.uqIn(customer_1.OrganizationCustomer, lodash_1.default.pick(data, ["ID", "OrganizationID"])));
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
            promises.push(joint.uqIn(customer_1.CustomerContact, { 'ID': customerId + '-' + v, 'CustomerID': customerId, 'TypeID': type, 'Content': v }));
        }
        await Promise.all(promises);
        return true;
    }
    catch (error) {
        console.error(error);
        return false;
    }
}
exports.customerPullWrite = customerPullWrite;
async function customerFirstPullWrite(joint, data) {
    try {
        await joint.uqIn(customer_1.Customer, lodash_1.default.pick(data, ["ID", "Name", "FirstName", "LastName", "Gender", "BirthDate", 'CreateTime', 'IsValid']));
        let promises = [];
        promises.push(joint.uqIn(customer_1.OrganizationCustomer, lodash_1.default.pick(data, ["ID", "OrganizationID"])));
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
            promises.push(joint.uqIn(customer_1.CustomerContact, { 'ID': customerId + '-' + v, 'CustomerID': customerId, 'TypeID': type, 'Content': v }));
        }
        promises.push(joint.uqIn(customer_1.CustomerHandler, { "CustomerID": customerId, "SalesmanID": data["SalesmanID"], "CustomerServiceStuffID": data("CustomerServiceStuffID") }));
        if (data['InvoiceTitle']) {
            promises.push(joint.uqIn(customer_1.InvoiceInfo, lodash_1.default.pick(data, ['ID', 'InvoiceTitle', 'TaxNo', 'RegisteredAddress', 'RegisteredTelephone', 'BankName', 'BankAccountNumber'])));
            promises.push(joint.uqIn(customer_1.CustomerSetting, {
                'CustomerID': customerId, 'InvoiceInfoID': customerId
            }));
        }
        let consigneeSql = `
            select ID, CID as CustomerID, userName as Name, userUnit as OrganizationName, isnull(userMobile, '') as Mobile
                    , email as Email, userZipCode as Zip, userAdd as Addr, isDefault
                    from dbs.dbo.net_OrderBase_txt where cid = @CustomerID order by ID`;
        promises.push(tools_1.execSql(consigneeSql, [{ 'name': 'CustomerID', 'value': customerId }]));
        let invoiceContactSql = `
            select ID, CID as CustomerID, Name, Unit as OrganizationName, isnull(Mobile, '') as Mobile, Tel as Telephone
                    , Email, Zip, Addr, isDefault
                    from dbs.dbo.order_InvoiceInfo_txt where CID > @CustomerID order by ID`;
        promises.push(tools_1.execSql(invoiceContactSql, [{ 'name': 'CustomerID', 'value': customerId }]));
        await Promise.all(promises);
        return true;
    }
    catch (error) {
        console.error(error);
        return false;
    }
}
exports.customerFirstPullWrite = customerFirstPullWrite;
async function consigneeContactPullWrite(joint, contactData) {
    try {
        await joint.uqIn(customer_1.Contact, contactData);
        await joint.uqIn(customer_1.CustomerContacts, lodash_1.default.pick(contactData, ["ID", "CustomerID"]));
        return true;
    }
    catch (error) {
        console.log(error);
        return false;
    }
}
exports.consigneeContactPullWrite = consigneeContactPullWrite;
//# sourceMappingURL=customerPullWrite.js.map