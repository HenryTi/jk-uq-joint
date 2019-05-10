import { Joint } from "../../uq-joint";
import _ from 'lodash';
import { Customer, OrganizationCustomer, CustomerContact, Contact, CustomerContacts, InvoiceInfo, CustomerSetting, CustomerHandler } from "../../settings/in/customer";
import { execSql } from "../../mssql/tools";

export async function customerPullWrite(joint: Joint, data: any): Promise<boolean> {
    try {
        await joint.uqIn(Customer, _.pick(data, ["ID", "Name", "FirstName", "LastName", "Gender", "BirthDate", 'CreateTime', 'IsValid']));
        let promises: PromiseLike<void>[] = [];
        promises.push(joint.uqIn(OrganizationCustomer, _.pick(data, ["ID", "OrganizationID"])));
        let customerId = data["ID"];
        let props: { name: string, type: string }[] = [
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
            if (!v) continue;
            promises.push(joint.uqIn(CustomerContact, { 'ID': customerId + '-' + v, 'CustomerID': customerId, 'TypeID': type, 'Content': v }));
        }
        await Promise.all(promises);
        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
}

export async function customerFirstPullWrite(joint: Joint, data: any): Promise<boolean> {
    try {
        await joint.uqIn(Customer, _.pick(data, ["ID", "Name", "FirstName", "LastName", "Gender", "BirthDate", 'CreateTime', 'IsValid']));
        let promises: PromiseLike<void>[] = [];
        promises.push(joint.uqIn(OrganizationCustomer, _.pick(data, ["ID", "OrganizationID"])));
        let customerId = data["ID"];
        let props: { name: string, type: string }[] = [
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
            if (!v) continue;
            promises.push(joint.uqIn(CustomerContact, { 'ID': customerId + '-' + v, 'CustomerID': customerId, 'TypeID': type, 'Content': v }));
        }

        promises.push(joint.uqIn(CustomerHandler, { "CustomerID": customerId, "SalesmanID": data["SalesmanID"], "CustomerServiceStuffID": data("CustomerServiceStuffID") }));
        if (data['InvoiceTitle']) {
            promises.push(joint.uqIn(InvoiceInfo, _.pick(data, ['ID', 'InvoiceTitle', 'TaxNo', 'RegisteredAddress', 'RegisteredTelephone', 'BankName', 'BankAccountNumber'])));
            promises.push(joint.uqIn(CustomerSetting, {
                'CustomerID': customerId, 'InvoiceInfoID': customerId
            }));
        }

        let consigneeSql = `
            select ID, CID as CustomerID, userName as Name, userUnit as OrganizationName, isnull(userMobile, '') as Mobile
                    , email as Email, userZipCode as Zip, userAdd as Addr, isDefault
                    from dbs.dbo.net_OrderBase_txt where cid = @CustomerID order by ID`;
        promises.push(execSql(consigneeSql, [{ 'name': 'CustomerID', 'value': customerId }]));

        let invoiceContactSql = `
            select ID, CID as CustomerID, Name, Unit as OrganizationName, isnull(Mobile, '') as Mobile, Tel as Telephone
                    , Email, Zip, Addr, isDefault
                    from dbs.dbo.order_InvoiceInfo_txt where CID > @CustomerID order by ID`;
        promises.push(execSql(invoiceContactSql, [{ 'name': 'CustomerID', 'value': customerId }]));

        await Promise.all(promises);
        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
}

export async function consigneeContactPullWrite(joint: Joint, contactData: any): Promise<boolean> {
    try {
        await joint.uqIn(Contact, contactData);
        await joint.uqIn(CustomerContacts, _.pick(contactData, ["ID", "CustomerID"]));
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
}