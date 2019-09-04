import { Joint } from "../../uq-joint";
import _ from 'lodash';
import dateFormat from 'dateformat';
import { Customer, OrganizationCustomer, CustomerContact, Contact, CustomerContacts, InvoiceInfo, CustomerSetting, CustomerHandler } from "../../settings/in/customer";
import { logger } from "../../tools/logger";

export async function customerPullWrite(joint: Joint, data: any): Promise<boolean> {
    try {
        if (!data["Name"])
            return true;

        data["CreateTime"] = data["CreateTime"] && dateFormat(data["CreateTime"], "yyyy-mm-dd HH:MM:ss");
        data["BirthDate"] = data["BirthDate"] && dateFormat(data["BirthDate"], "yyyy-mm-dd HH:MM:ss");
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
            /*
            promises.push(joint.uqIn(CustomerSetting, {
                'CustomerID': customerId, 'InvoiceInfoID': customerId
            }));
            */
        }

        await Promise.all(promises);
        return true;
    } catch (error) {
        logger.error(error);
        throw error;
    }
}

export async function contactPullWrite(joint: Joint, contactData: any): Promise<boolean> {
    try {
        await joint.uqIn(Contact, contactData);
        await joint.uqIn(CustomerContacts, _.pick(contactData, ["ID", "CustomerID", "isDefault"]));
        return true;
    } catch (error) {
        logger.error(error);
        throw error;
    }
}