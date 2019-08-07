import { Joint } from "../../uq-joint";
import _ from 'lodash';
import dateFormat from 'dateformat';
import { Customer, OrganizationCustomer, CustomerContact, Contact, CustomerContacts, InvoiceInfo, CustomerSetting, CustomerHandler } from "../../settings/in/customer";
import { execSql } from "../../mssql/tools";
import { pushRecordset } from "./productPullWrite";

export async function customerPullWrite(joint: Joint, data: any): Promise<boolean> {
    try {
        data["CreateTime"] = data["CreateTime"] && dateFormat(data["CreateTime"], "yyyy-mm-dd HH:MM:ss");
        await joint.uqIn(Customer, _.pick(data, ["CustomerID", "Name", "FirstName", "LastName", "XYZ", "Gender", "BirthDate", 'CreateTime', 'IsValid']));
        let promises: PromiseLike<void>[] = [];
        promises.push(joint.uqIn(OrganizationCustomer, _.pick(data, ["CustomerID", "OrganizationID"])));
        let customerId = data["CustomerID"];
        let props: { name: string, type: string }[] = [
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
            if (!v) continue;
            promises.push(joint.uqIn(CustomerContact, { 'ID': customerId + '-' + name, 'CustomerID': customerId, 'TypeID': type, 'Content': v }));
        }

        promises.push(joint.uqIn(CustomerHandler, { "CustomerID": customerId, "SalesmanID": data["SalesmanID"], "CustomerServiceStuffID": data["CustomerServiceStuffID"] }));
        if (data['InvoiceTitle']) {
            // CustomerID作为发票的no
            promises.push(joint.uqIn(InvoiceInfo, _.pick(data, ['CustomerID', 'InvoiceTitle', 'TaxNo', 'RegisteredAddress', 'RegisteredTelephone', 'BankName', 'BankAccountNumber'])));
            promises.push(joint.uqIn(CustomerSetting, {
                'CustomerID': customerId, 'InvoiceInfoID': customerId
            }));
        }

        await Promise.all(promises);
        return true;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export async function customerFirstPullWrite(joint: Joint, data: any): Promise<boolean> {
    try {
        data["CreateTime"] = data["CreateTime"] && dateFormat(data["CreateTime"], "yyyy-mm-dd HH:MM:ss");
        await joint.uqIn(Customer, _.pick(data, ["ID", "CustomerID", "Name", "FirstName", "LastName", "XYZ", "Gender", "BirthDate", 'CreateTime', 'IsValid']));
        let promises: PromiseLike<any>[] = [];
        promises.push(joint.uqIn(OrganizationCustomer, _.pick(data, ["CustomerID", "OrganizationID"])));
        let customerId = data["CustomerID"];
        let props: { name: string, type: string }[] = [
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
            if (!v) continue;
            promises.push(joint.uqIn(CustomerContact, { 'ID': customerId + '-' + name, 'CustomerID': customerId, 'TypeID': type, 'Content': v }));
        }

        promises.push(joint.uqIn(CustomerHandler, { "CustomerID": customerId, "SalesmanID": data["SalesmanID"], "CustomerServiceStuffID": data["CustomerServiceStuffID"] }));
        if (data['InvoiceTitle']) {
            // CustomerID作为发票的no
            promises.push(joint.uqIn(InvoiceInfo, _.pick(data, ['CustomerID', 'InvoiceTitle', 'TaxNo', 'RegisteredAddress', 'RegisteredTelephone', 'BankName', 'BankAccountNumber'])));
            promises.push(joint.uqIn(CustomerSetting, {
                'CustomerID': customerId, 'InvoiceInfoID': customerId
            }));
        }

        let promisesSql: PromiseLike<any>[] = [];
        let consigneeSql = `
            select ID, CID as CustomerID, userName as Name, userUnit as OrganizationName, isnull(userMobile, '') as Mobile
                    , email as Email, userZipCode as Zip, userAdd as Addr, isDefault
                    from dbs.dbo.net_OrderBase_txt where cid = @CustomerID and userName is not null order by ID`;
        promisesSql.push(execSql(consigneeSql, [{ 'name': 'CustomerID', 'value': customerId }]));

        let invoiceContactSql = `
            select ID, CID as CustomerID, Name, Unit as OrganizationName, isnull(Mobile, '') as Mobile, Tel as Telephone
                    , Email, Zip, Addr, isDefault
                    from dbs.dbo.order_InvoiceInfo_txt where CID = @CustomerID and Name is not null order by ID`;
        promisesSql.push(execSql(invoiceContactSql, [{ 'name': 'CustomerID', 'value': customerId }]));
        let sqlResult = await Promise.all(promisesSql);
        promises.push(pushRecordset(joint, sqlResult[0], Contact));
        promises.push(pushRecordset(joint, sqlResult[1], Contact));
        await Promise.all(promises);
        return true;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export async function consigneeContactPullWrite(joint: Joint, contactData: any): Promise<boolean> {
    try {
        await joint.uqIn(Contact, contactData);
        await joint.uqIn(CustomerContacts, _.pick(contactData, ["ID", "CustomerID"]));
        return true;
    } catch (error) {
        console.error(error);
        throw error;
    }
}