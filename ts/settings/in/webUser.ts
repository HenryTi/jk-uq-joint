import { UqInTuid, UqInMap, Joint, DataPullResult } from "../../uq-joint";
import * as _ from 'lodash';
import { uqs } from "../uqs";
import config from 'config';
import { logger } from "../../tools/logger";
import { Contact, InvoiceInfo } from "./customer";
import { Address } from "./Address";
import { execSql } from "../../uq-joint/db/mysql/tool";
import { databaseName } from "../../uq-joint/db/mysql/database";

const promiseSize = config.get<number>("promiseSize");

export const WebUserTonva: UqInTuid = {
    uq: uqs.jkWebUser,
    type: 'tuid',
    entity: 'WebUserTonva',
    key: 'WebUserID',
    mapper: {
        $type: 'Type',      // 固定值:$user
        id: 'WebUserID@WebUser',
        name: 'UserName',
        pwd: 'Password',
        nick: "IGNORE",
        icon: "IGNORE",
        country: "IGNORE",
        mobile: 'Mobile',
        email: 'Email',
        wechat: 'WechatOpenID',
    },
    pull: `select top ${promiseSize} ID, WebUserID, '$user' as Type, UserName, Password, null as Nick, null as Icon
           , TrueName as FirstName, OrganizationName, DepartmentName, Salutation
           , Mobile, Telephone, Email, Fax, WechatOpenID
           , Country, Province, City, Address, ZipCode
           , InvoiceType, InvoiceTitle, TaxNo, BankAccountName
           , CustomerID, SalesRegionBelongsTo, SalesCompanyID
           from alidb.ProdData.dbo.Export_WebUser w
           where ID > @iMaxId and State = 1 order by ID`,
    pullWrite: async (joint: Joint, data: any) => {
        try {
            let userId = await joint.userIn(WebUserTonva,
                _.pick(data,
                    ['Type', 'WebUserID', 'UserName', 'Password', 'Nick', 'Icon', 'Mobile', 'Email', 'WechatOpenID']));
            if (userId < 0)
                return true;
            data.UserID = userId;
            let promises: PromiseLike<any>[] = [];
            promises.push(joint.uqIn(WebUser, _.pick(data, ['UserID', 'WebUserID', 'FirstName', 'Salutation', 'OrganizationName', 'DepartmentName'])));
            promises.push(joint.uqIn(WebUserContact, _.pick(data, ['UserID', 'Mobile', 'Email', 'OrganizationName', 'DepartmentName'
                , 'Telephone', 'Fax', 'ZipCode', 'WechatOpenID', 'Address'])));
            if (data['CustomerID'])
                promises.push(joint.uqIn(WebUserCustomer, _.pick(data, ['UserID', 'CustomerID'])));
            if (data['InvoiceTitle']) {
                promises.push(InvoiceInfoIn(joint, data, userId));
            }
            if (data['InvoiceType']) {
                let invoiceTypeId = data['InvoiceType'] === '增值发票' ? 2 : 1;
                WebUserSettingAlter.mapper.arr1["contentId"] = "^contentID";
                promises.push(joint.uqIn(WebUserSettingAlter, { 'UserID': userId, 'Type': 'ivInvoiceType', 'contentID': invoiceTypeId }));
            }
            await Promise.all(promises);
            return true;
        } catch (error) {
            logger.error(error);
            throw error;
        }
    }
};

async function InvoiceInfoIn(joint: Joint, data: any, userId: number): Promise<any> {
    if (data['InvoiceTitle']) {
        await joint.uqIn(InvoiceInfo, {
            "CustomerID": data["WebUserID"], "InvoiceTitle": data["InvoiceTitle"]
            , "RegisteredAddress": data['TaxNo'], "BankName": data['BankAccountName'], 'InvoiceType': data['InvoiceType']
        });
        WebUserSettingAlter.mapper.arr1["contentId"] = "^contentID@InvoiceInfo";
        await joint.uqIn(WebUserSettingAlter, { 'UserID': userId, 'Type': 'ivInvoiceInfo', 'contentID': data['WebUserID'] });
    }
}

export const WebUser: UqInTuid = {
    uq: uqs.jkWebUser,
    type: 'tuid',
    entity: 'WebUser',
    key: 'WebUserID',
    mapper: {
        $id: 'UserID',
        no: "WebUserID",
        name: 'FirstName',
        firstName: "FirstName",
        salutation: "Salutation",
        organizationName: 'OrganizationName',
        departmentName: 'DepartmentName',
    }
}

export const WebUserContact: UqInMap = {
    uq: uqs.jkWebUser,
    type: 'map',
    entity: 'WebUserContact',
    mapper: {
        webUser: 'UserID',
        mobile: 'Mobile',
        email: 'Email',
        organizationName: 'OrganizationName',
        departmentName: 'DepartmentName',
        telephone: 'Telephone',
        fax: 'Fax',
        zipCode: 'ZipCode',
        address: '',
        addressString: 'Address',
        wechatId: 'Wechat',
    }
};

export const WebUserCustomer: UqInMap = {
    uq: uqs.jkWebUser,
    type: 'map',
    entity: 'WebUserCustomer',
    mapper: {
        webUser: 'UserID',
        customer: 'CustomerID@Customer',
    }
};

export const WebUserContacts: UqInMap = {
    uq: uqs.jkWebUser,
    type: 'map',
    entity: 'WebUserContacts',
    mapper: {
        webUser: 'UserID',
        arr1: {
            contact: '^ID@Contact',
        }
    },
    pull: `select top ${promiseSize} ID, AddressID as ContactID, WebUserID, Name, OrganizationName, Mobile, Telephone, CountryID
           , ProvinceID, CityID, [Address] as Addr, ZipCode, Email, IsDefault, AddressType
           from alidb.ProdData.dbo.Export_WebUserAddress where ID > @iMaxId order by ID`,
    pullWrite: async (joint: Joint, data: any) => {
        try {
            let userId = -1;
            try {
                userId = await getUserId(data['WebUserID']);
            } catch (error) {

            }
            if (userId <= 0)
                throw 'web user not import, wait next';

            let addressId = data['CountyID'] || data['CityID'] || data['ProvinceID'] || data["CountryID"];
            if (addressId) {
                await joint.uqIn(Address, { 'ID': addressId, 'CountryID': data['CountryID'], 'ProvinceID': data['ProvinceID'], 'CityID': data['CityID'] });
            }
            data['AddressID'] = addressId;
            await joint.uqIn(Contact, data);

            await joint.uqIn(WebUserContacts, { 'UserID': userId, 'ID': data['ContactID'] });
            if (data['IsDefault']) {
                WebUserSettingAlter.mapper.arr1["contentId"] = "^contentID@Contact";
                let type = data["AddressType"] === 0 ? 'ivShippingContact' : 'ivInvoiceContact';
                await joint.uqIn(WebUserSettingAlter, { 'UserID': userId, 'Type': type, 'contentID': data['ContactID'] });
            }
            return true;
        } catch (error) {
            logger.error(error);
            throw error;
        }
    }
};


async function getUserId(webUserID: string) {
    let sql = `select id from \`${databaseName}\`.\`map_webuser\` where no='${webUserID}'`;
    let ret: any[];
    try {
        ret = await execSql(sql);
        if (ret.length === 1)
            return ret[0]['id'];
    }
    catch (err) {
        throw err;
    }
    return -1;
}

export const WebUserSetting: UqInMap = {
    uq: uqs.jkWebUser,
    type: 'map',
    entity: 'WebUserSetting',
    mapper: {
        webUser: 'UserID',
        shippingContact: 'ShippingContactID@Contact',
        invoiceContact: 'InvoiceContactID@Contact',
        invoiceType: 'InvoiceTypeID@InvoiceType',
        invoiceInfo: 'InvoiceInfoID@InvoiceInfo',
    }
};

export const WebUserSettingAlter: UqInMap = {
    uq: uqs.jkWebUser,
    type: 'map',
    entity: 'WebUserSettingAlter',
    mapper: {
        webUser: 'UserID',
        arr1: {
            type: '^Type@WebUserSettingType',
            contentId: '^contentID',
        }
    }
};

export const WebUserSettingType: UqInTuid = {
    uq: uqs.jkWebUser,
    type: 'tuid',
    entity: 'WebUserSettingType',
    key: 'WebUserSettingTypeID',
    mapper: {
        $id: 'WebUserSettingTypeID@WebUserSettingType',
        description: "Description",
    }
}