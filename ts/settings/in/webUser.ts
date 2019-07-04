import { UqInTuid, UqInMap, Joint, DataPullResult } from "../../uq-joint";
import * as _ from 'lodash';
import { uqs } from "../uqs";
import config from 'config';

const promiseSize = config.get<number>("promiseSize");

export const WebUser: UqInTuid = {
    uq: uqs.jkWebUser,
    type: 'tuid',
    entity: 'WebUser',
    key: 'WebUserID',
    mapper: {
        $type: 'Type',      // 固定值:$user
        id: 'WebUserID',
        name: 'UserName',
        pwd: 'Password',
        nick: "Nick",
        icon: "Icon",
        country: "CountryID@Country",
        mobile: 'Mobile',
        email: 'Email',
        wechat: 'Wechat',

        // no: "WebUserID",
        // firstName: "FirstName",
        // salutation: "Salutation",
        // organizationName: 'OrganizationName',
    },
    pull: `select top ${promiseSize} ci.ID, ci.ID as WebUserID, '$user' as Type, cl.UserName, cl.EncryptedPassword as Password, null as Nick, null as Icon
           , null as CountryID, cc.Mobile, cc.Email, cl.WebChatID as Wechat
           , ci.TrueName as FirstName, ci.Company as OrganizationName, organization as DepartmentName, ci.Title as Salutation
           , cc.PostalCode as ZipCode
           from alidb.jk_eb.dbo.ClientInfo ci inner join alidb.jk_eb.dbo.ClientLogin cl on cl.CIID = ci.ID
           inner join alidb.jk_eb.dbo.ClienContact cc on cc.CIID = cl.ID
           where ci.ID > @iMaxId order by ci.ID`,
    pullWrite: async (joint: Joint, data: any) => {
        try {
            await joint.userIn(WebUser,
                _.pick(data,
                    ['Type', 'WebUserID', 'UserName', 'Password', 'Nick', 'Icon', 'CountryID', 'Mobile', 'Email', 'Wechat'
                        , 'Salutation', 'OrgnizationName', 'FirstName']));
            return true;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
};

export const WebUserContact: UqInMap = {
    uq: uqs.jkWebUser,
    type: 'map',
    entity: 'WebUserContact',
    mapper: {
        webUser: 'WebUserID@WebUser',
        arr1: {
            mobile: '^Mobile',
            email: '^Email',
            organizationName: '^OrganizationName',
            departmentName: '^DepartmentName',
            telephone: '^Telephone',
            fax: '^Fax',
            zipCode: '^ZipCode',
            address: '',
            wechatId: 'Wechat',
        }
    }
};

export const WebUserCustomer: UqInMap = {
    uq: uqs.jkWebUser,
    type: 'map',
    entity: 'WebUserCustomer',
    mapper: {
        webUser: 'WebUserID@WebUser',
        arr1: {
            customer: '^CID@Customer',
        }
    }
};

export const WebUserContacts: UqInMap = {
    uq: uqs.jkWebUser,
    type: 'map',
    entity: 'WebUserContacts',
    mapper: {
        webUser: 'WebUserID@WebUser',
        arr1: {
            contact: '^ID@Contact',
        }
    }
};

export const WebUserSetting: UqInMap = {
    uq: uqs.jkWebUser,
    type: 'map',
    entity: 'WebUserSetting',
    mapper: {
        customer: 'WebUserID@WebUser',
        arr1: {
            shippingContact: '^ShippingContactID@Contact',
            invoiceContact: '^InvoiceContactID@Contact',
            invoiceType: '^InvoiceTypeID@InvoiceType',
            invoiceInfo: '^InvoiceInfoID@InvoiceInfo',
        }
    }
};