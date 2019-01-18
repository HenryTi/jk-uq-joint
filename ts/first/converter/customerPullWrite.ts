import { Joint } from "../../usq-joint";
import * as _ from 'lodash';

export async function customerPullWrite(joint: Joint, customerData: any) {

    try {
        await joint.pushToUsq("Customer", _.pick(customerData, ["ID", "Name", "FirstName", "LastName", "Gender", "BirthDate", 'CreateTime']));
        await joint.pushToUsq("OrganizationCustomer", _.pick(customerData, ["ID", "OrganizationID"]));
        if (customerData["Tel1"]) {
            await joint.pushToUsq("CustomerContact", { 'ID': customerData['ID'] + '-Tel1', 'CustomerID': customerData['ID'], 'TypeID': 'tel', 'Content': customerData['Tel1'] });
        }
        if (customerData["Tel2"]) {
            await joint.pushToUsq("CustomerContact", { 'ID': customerData['ID'] + '-Tel2', 'CustomerID': customerData['ID'], 'TypeID': 'tel', 'Content': customerData['Tel2'] });
        }
        if (customerData["Mobile"]) {
            await joint.pushToUsq("CustomerContact", { 'ID': customerData['ID'] + '-Mobile', 'CustomerID': customerData['ID'], 'TypeID': 'mobile', 'Content': customerData['Mobile'] });
        }
        if (customerData["Email"]) {
            await joint.pushToUsq("CustomerContact", { 'ID': customerData['ID'] + '-Email', 'CustomerID': customerData['ID'], 'TypeID': 'email', 'Content': customerData['Email'] });
        }
        if (customerData["Email2"]) {
            await joint.pushToUsq("CustomerContact", { 'ID': customerData['ID'] + '-Email2', 'CustomerID': customerData['ID'], 'TypeID': 'email', 'Content': customerData['Email2'] });
        }
        if (customerData["Fax1"]) {
            await joint.pushToUsq("CustomerContact", { 'ID': customerData['ID'] + '-Fax1', 'CustomerID': customerData['ID'], 'TypeID': 'fax', 'Content': customerData['Fax1'] });
        }
        if (customerData["Fax2"]) {
            await joint.pushToUsq("CustomerContact", { 'ID': customerData['ID'] + '-Fax2', 'CustomerID': customerData['ID'], 'TypeID': 'fax', 'Content': customerData['Fax2'] });
        }
    } catch (error) {
        console.error(error);
    }
}

export async function consigneeContactPullWrite(joint: Joint, contactData: any) {

    try {
        await joint.pushToUsq("Contact", contactData);
        await joint.pushToUsq("CustomerConsigneeContact", _.pick(contactData, ["ID", "CustomerID"]));
    } catch (error) {
        console.log(error);
    }
}

export async function invoiceContactPullWrite(joint: Joint, contactData: any) {

    try {
        await joint.pushToUsq("Contact", contactData);
        await joint.pushToUsq("CustomerInvoiceContact", _.pick(contactData, ["ID", "CustomerID"]));
    } catch (error) {
        console.log(error);
    }
}