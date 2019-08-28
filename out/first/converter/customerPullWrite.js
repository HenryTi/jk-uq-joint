"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = __importDefault(require("lodash"));
const dateformat_1 = __importDefault(require("dateformat"));
const customer_1 = require("../../settings/in/customer");
const logger_1 = require("../../tools/logger");
async function customerPullWrite(joint, data) {
    try {
        if (!data["Name"])
            return true;
        data["CreateTime"] = data["CreateTime"] && dateformat_1.default(data["CreateTime"], "yyyy-mm-dd HH:MM:ss");
        data["BirthDate"] = data["BirthDate"] && dateformat_1.default(data["BirthDate"], "yyyy-mm-dd HH:MM:ss");
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
        logger_1.logger.error(error);
        throw error;
    }
}
exports.customerPullWrite = customerPullWrite;
async function contactPullWrite(joint, contactData) {
    try {
        await joint.uqIn(customer_1.Contact, contactData);
        await joint.uqIn(customer_1.CustomerContacts, lodash_1.default.pick(contactData, ["ID", "CustomerID"]));
        return true;
    }
    catch (error) {
        logger_1.logger.error(error);
        throw error;
    }
}
exports.contactPullWrite = contactPullWrite;
//# sourceMappingURL=customerPullWrite.js.map