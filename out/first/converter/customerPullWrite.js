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
const customer_1 = require("../../settings/in/customer");
async function customerPullWrite(joint, customerData) {
    try {
        await joint.usqIn(customer_1.Customer, _.pick(customerData, ["ID", "Name", "FirstName", "LastName", "Gender", "BirthDate", 'CreateTime']));
        await joint.usqIn(customer_1.OrganizationCustomer, _.pick(customerData, ["ID", "OrganizationID"]));
        if (customerData["Tel1"]) {
            await joint.usqIn(customer_1.CustomerContact, { 'ID': customerData['ID'] + '-Tel1', 'CustomerID': customerData['ID'], 'TypeID': 'tel', 'Content': customerData['Tel1'] });
        }
        if (customerData["Tel2"]) {
            await joint.usqIn(customer_1.CustomerContact, { 'ID': customerData['ID'] + '-Tel2', 'CustomerID': customerData['ID'], 'TypeID': 'tel', 'Content': customerData['Tel2'] });
        }
        if (customerData["Mobile"]) {
            await joint.usqIn(customer_1.CustomerContact, { 'ID': customerData['ID'] + '-Mobile', 'CustomerID': customerData['ID'], 'TypeID': 'mobile', 'Content': customerData['Mobile'] });
        }
        if (customerData["Email"]) {
            await joint.usqIn(customer_1.CustomerContact, { 'ID': customerData['ID'] + '-Email', 'CustomerID': customerData['ID'], 'TypeID': 'email', 'Content': customerData['Email'] });
        }
        if (customerData["Email2"]) {
            await joint.usqIn(customer_1.CustomerContact, { 'ID': customerData['ID'] + '-Email2', 'CustomerID': customerData['ID'], 'TypeID': 'email', 'Content': customerData['Email2'] });
        }
        if (customerData["Fax1"]) {
            await joint.usqIn(customer_1.CustomerContact, { 'ID': customerData['ID'] + '-Fax1', 'CustomerID': customerData['ID'], 'TypeID': 'fax', 'Content': customerData['Fax1'] });
        }
        if (customerData["Fax2"]) {
            await joint.usqIn(customer_1.CustomerContact, { 'ID': customerData['ID'] + '-Fax2', 'CustomerID': customerData['ID'], 'TypeID': 'fax', 'Content': customerData['Fax2'] });
        }
    }
    catch (error) {
        console.error(error);
    }
}
exports.customerPullWrite = customerPullWrite;
async function consigneeContactPullWrite(joint, contactData) {
    try {
        await joint.usqIn(customer_1.Contact, contactData);
        await joint.usqIn(customer_1.CustomerContacts, _.pick(contactData, ["ID", "CustomerID"]));
    }
    catch (error) {
        console.log(error);
    }
}
exports.consigneeContactPullWrite = consigneeContactPullWrite;
//# sourceMappingURL=customerPullWrite.js.map