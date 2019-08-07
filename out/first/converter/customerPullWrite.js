"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = __importDefault(require("lodash"));
const dateformat_1 = __importDefault(require("dateformat"));
const customer_1 = require("../../settings/in/customer");
const tools_1 = require("../../mssql/tools");
const productPullWrite_1 = require("./productPullWrite");
async function customerPullWrite(joint, data) {
    try {
        data["CreateTime"] = data["CreateTime"] && dateformat_1.default(data["CreateTime"], "yyyy-mm-dd HH:MM:ss");
        await joint.uqIn(customer_1.Customer, lodash_1.default.pick(data, ["CustomerID", "Name", "FirstName", "LastName", "XYZ", "Gender", "BirthDate", 'CreateTime', 'IsValid']));
        let promises = [];
        promises.push(joint.uqIn(customer_1.OrganizationCustomer, lodash_1.default.pick(data, ["CustomerID", "OrganizationID"])));
        let customerId = data["CustomerID"];
        let props = [
            { name: 'Tel1', type: 'tel1' },
            { name: 'Tel2', type: 'tel2' },
            { name: 'Mobile', type: 'mobile' },
            { name: 'Email1', type: 'email1' },
            { name: 'Email2', type: 'email2' },
            { name: 'Fax1', type: 'fax1' },
            { name: 'Fax2', type: 'fax2' },
        ];
        for (let prop of props) {
            let { name, type } = prop;
            let v = data[name];
            if (!v)
                continue;
            promises.push(joint.uqIn(customer_1.CustomerContact, { 'ID': customerId + '-' + name, 'CustomerID': customerId, 'TypeID': type, 'Content': v }));
        }
        promises.push(joint.uqIn(customer_1.CustomerHandler, { "CustomerID": customerId, "SalesmanID": data["SalesmanID"], "CustomerServiceStuffID": data["CustomerServiceStuffID"] }));
        if (data['InvoiceTitle']) {
            // CustomerID作为发票的no
            promises.push(joint.uqIn(customer_1.InvoiceInfo, lodash_1.default.pick(data, ['CustomerID', 'InvoiceTitle', 'TaxNo', 'RegisteredAddress', 'RegisteredTelephone', 'BankName', 'BankAccountNumber'])));
            promises.push(joint.uqIn(customer_1.CustomerSetting, {
                'CustomerID': customerId, 'InvoiceInfoID': customerId
            }));
        }
        await Promise.all(promises);
        return true;
    }
    catch (error) {
        console.error(error);
        throw error;
    }
}
exports.customerPullWrite = customerPullWrite;
async function customerFirstPullWrite(joint, data) {
    try {
        data["CreateTime"] = data["CreateTime"] && dateformat_1.default(data["CreateTime"], "yyyy-mm-dd HH:MM:ss");
        await joint.uqIn(customer_1.Customer, lodash_1.default.pick(data, ["ID", "CustomerID", "Name", "FirstName", "LastName", "XYZ", "Gender", "BirthDate", 'CreateTime', 'IsValid']));
        let promises = [];
        promises.push(joint.uqIn(customer_1.OrganizationCustomer, lodash_1.default.pick(data, ["CustomerID", "OrganizationID"])));
        let customerId = data["CustomerID"];
        let props = [
            { name: 'Tel1', type: 'tel1' },
            { name: 'Tel2', type: 'tel2' },
            { name: 'Mobile', type: 'mobile' },
            { name: 'Email1', type: 'email1' },
            { name: 'Email2', type: 'email2' },
            { name: 'Fax1', type: 'fax1' },
            { name: 'Fax2', type: 'fax2' },
        ];
        for (let prop of props) {
            let { name, type } = prop;
            let v = data[name];
            if (!v)
                continue;
            promises.push(joint.uqIn(customer_1.CustomerContact, { 'ID': customerId + '-' + name, 'CustomerID': customerId, 'TypeID': type, 'Content': v }));
        }
        promises.push(joint.uqIn(customer_1.CustomerHandler, { "CustomerID": customerId, "SalesmanID": data["SalesmanID"], "CustomerServiceStuffID": data["CustomerServiceStuffID"] }));
        if (data['InvoiceTitle']) {
            // CustomerID作为发票的no
            promises.push(joint.uqIn(customer_1.InvoiceInfo, lodash_1.default.pick(data, ['CustomerID', 'InvoiceTitle', 'TaxNo', 'RegisteredAddress', 'RegisteredTelephone', 'BankName', 'BankAccountNumber'])));
            promises.push(joint.uqIn(customer_1.CustomerSetting, {
                'CustomerID': customerId, 'InvoiceInfoID': customerId
            }));
        }
        let promisesSql = [];
        let consigneeSql = `
            select ID, CID as CustomerID, userName as Name, userUnit as OrganizationName, isnull(userMobile, '') as Mobile
                    , email as Email, userZipCode as Zip, userAdd as Addr, isDefault
                    from dbs.dbo.net_OrderBase_txt where cid = @CustomerID and userName is not null order by ID`;
        promisesSql.push(tools_1.execSql(consigneeSql, [{ 'name': 'CustomerID', 'value': customerId }]));
        let invoiceContactSql = `
            select ID, CID as CustomerID, Name, Unit as OrganizationName, isnull(Mobile, '') as Mobile, Tel as Telephone
                    , Email, Zip, Addr, isDefault
                    from dbs.dbo.order_InvoiceInfo_txt where CID = @CustomerID and Name is not null order by ID`;
        promisesSql.push(tools_1.execSql(invoiceContactSql, [{ 'name': 'CustomerID', 'value': customerId }]));
        let sqlResult = await Promise.all(promisesSql);
        promises.push(productPullWrite_1.pushRecordset(joint, sqlResult[0], customer_1.Contact));
        promises.push(productPullWrite_1.pushRecordset(joint, sqlResult[1], customer_1.Contact));
        await Promise.all(promises);
        return true;
    }
    catch (error) {
        console.error(error);
        throw error;
    }
}
exports.customerFirstPullWrite = customerFirstPullWrite;
async function contactPullWrite(joint, contactData) {
    try {
        await joint.uqIn(customer_1.Contact, contactData);
        await joint.uqIn(customer_1.CustomerContacts, lodash_1.default.pick(contactData, ["ID", "CustomerID"]));
        return true;
    }
    catch (error) {
        console.error(error);
        throw error;
    }
}
exports.contactPullWrite = contactPullWrite;
//# sourceMappingURL=customerPullWrite.js.map