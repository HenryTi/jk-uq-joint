import { Joint } from "../../usq-joint";
import _ from 'lodash';
import { Customer, OrganizationCustomer, CustomerContact, Contact, CustomerContacts } from "../../settings/in/customer";

export async function customerPullWrite(joint: Joint, customerData: any)
{
    try {
        await joint.usqIn(Customer, _.pick(customerData, ["ID", "Name", "FirstName", "LastName", "Gender", "BirthDate", 'CreateTime']));
        await joint.usqIn(OrganizationCustomer, _.pick(customerData, ["ID", "OrganizationID"]));
        /*
        if (customerData["Tel1"]) {
            await joint.usqIn(CustomerContact, { 'ID': customerData['ID'] + '-Tel1', 'CustomerID': customerData['ID'], 'TypeID': 'tel', 'Content': customerData['Tel1'] });
        }
        if (customerData["Tel2"]) {
            await joint.usqIn(CustomerContact, { 'ID': customerData['ID'] + '-Tel2', 'CustomerID': customerData['ID'], 'TypeID': 'tel', 'Content': customerData['Tel2'] });
        }
        if (customerData["Mobile"]) {
            await joint.usqIn(CustomerContact, { 'ID': customerData['ID'] + '-Mobile', 'CustomerID': customerData['ID'], 'TypeID': 'mobile', 'Content': customerData['Mobile'] });
        }
        if (customerData["Email"]) {
            await joint.usqIn(CustomerContact, { 'ID': customerData['ID'] + '-Email', 'CustomerID': customerData['ID'], 'TypeID': 'email', 'Content': customerData['Email'] });
        }
        if (customerData["Email2"]) {
            await joint.usqIn(CustomerContact, { 'ID': customerData['ID'] + '-Email2', 'CustomerID': customerData['ID'], 'TypeID': 'email', 'Content': customerData['Email2'] });
        }
        if (customerData["Fax1"]) {
            await joint.usqIn(CustomerContact, { 'ID': customerData['ID'] + '-Fax1', 'CustomerID': customerData['ID'], 'TypeID': 'fax', 'Content': customerData['Fax1'] });
        }
        if (customerData["Fax2"]) {
            await joint.usqIn(CustomerContact, { 'ID': customerData['ID'] + '-Fax2', 'CustomerID': customerData['ID'], 'TypeID': 'fax', 'Content': customerData['Fax2'] });
        }
        */
        let props:{name:string, type:string}[] = [
            {name: 'Tel1', type: 'tel'},
            {name: 'Tel2', type: 'tel'},
            {name: 'Mobile', type: 'mobile'},
            {name: 'Email1', type: 'email'},
            {name: 'Email2', type: 'email'},
            {name: 'Fax1', type: 'fax'},
            {name: 'Fax2', type: 'fax'},
        ];
        for (let prop of props) {
            let {name, type} = prop;
            let v = customerData[name];
            if (v === undefined) continue;
            let {ID} = customerData;
            await joint.usqIn(CustomerContact, { 'ID': ID + '-Email2', 'CustomerID': ID, 'TypeID': type, 'Content': v });
        }
    } catch (error) {
        console.error(error);
    }
}

export async function consigneeContactPullWrite(joint: Joint, contactData: any)
{
    try {
        await joint.usqIn(Contact, contactData);
        await joint.usqIn(CustomerContacts, _.pick(contactData, ["ID", "CustomerID"]));
    } catch (error) {
        console.log(error);
    }
}