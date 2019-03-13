/*
import { Joint } from "../../uq-joint";
import _ from 'lodash';
import { Customer, OrganizationCustomer, CustomerContact, Contact, CustomerContacts } from "../../settings/in/customer";

export async function customerPullWrite(joint: Joint, customerData: any): Promise<boolean> {
    try {
        await joint.uqIn(Customer, _.pick(customerData, ["ID", "Name", "FirstName", "LastName", "Gender", "BirthDate", 'CreateTime']));
        await joint.uqIn(OrganizationCustomer, _.pick(customerData, ["ID", "OrganizationID"]));
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
            let v = customerData[name];
            if (!v) continue;
            let { ID } = customerData;
            await joint.uqIn(CustomerContact, { 'ID': ID + '-' + v, 'CustomerID': ID, 'TypeID': type, 'Content': v });
        }
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
*/ 
//# sourceMappingURL=customerPullWrite.js.map