"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const _ = __importStar(require("lodash"));
const uqs_1 = require("../uqs");
const config_1 = __importDefault(require("config"));
const logger_1 = require("../../tools/logger");
const customer_1 = require("./customer");
const Address_1 = require("./Address");
const tool_1 = require("../../uq-joint/db/mysql/tool");
const database_1 = require("../../uq-joint/db/mysql/database");
const promiseSize = config_1.default.get("promiseSize");
exports.WebUserTonva = {
    uq: uqs_1.uqs.jkWebUser,
    type: 'tuid',
    entity: 'WebUserTonva',
    key: 'WebUserID',
    mapper: {
        $type: 'Type',
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
    pullWrite: async (joint, data) => {
        try {
            let userId = await joint.userIn(exports.WebUserTonva, _.pick(data, ['Type', 'WebUserID', 'UserName', 'Password', 'Nick', 'Icon', 'Mobile', 'Email', 'WechatOpenID']));
            if (userId < 0)
                return true;
            data.UserID = userId;
            let promises = [];
            promises.push(joint.uqIn(exports.WebUser, _.pick(data, ['UserID', 'WebUserID', 'FirstName', 'Salutation', 'OrganizationName', 'DepartmentName'])));
            promises.push(joint.uqIn(exports.WebUserContact, _.pick(data, ['UserID', 'Mobile', 'Email', 'OrganizationName', 'DepartmentName',
                'Telephone', 'Fax', 'ZipCode', 'WechatOpenID', 'Address'])));
            if (data['CustomerID'])
                promises.push(joint.uqIn(exports.WebUserCustomer, _.pick(data, ['UserID', 'CustomerID'])));
            if (data['InvoiceTitle']) {
                promises.push(InvoiceInfoIn(joint, data, userId));
            }
            if (data['InvoiceType']) {
                let invoiceTypeId = data['InvoiceType'] === '增值发票' ? 2 : 1;
                exports.WebUserSettingAlter.mapper.arr1["contentId"] = "^contentID";
                promises.push(joint.uqIn(exports.WebUserSettingAlter, { 'UserID': userId, 'Type': 'ivInvoiceType', 'contentID': invoiceTypeId }));
            }
            await Promise.all(promises);
            return true;
        }
        catch (error) {
            logger_1.logger.error(error);
            throw error;
        }
    }
};
async function InvoiceInfoIn(joint, data, userId) {
    if (data['InvoiceTitle']) {
        await joint.uqIn(customer_1.InvoiceInfo, {
            "CustomerID": data["WebUserID"], "InvoiceTitle": data["InvoiceTitle"],
            "RegisteredAddress": data['TaxNo'], "BankName": data['BankAccountName'], 'InvoiceType': data['InvoiceType']
        });
        exports.WebUserSettingAlter.mapper.arr1["contentId"] = "^contentID@InvoiceInfo";
        await joint.uqIn(exports.WebUserSettingAlter, { 'UserID': userId, 'Type': 'ivInvoiceInfo', 'contentID': data['WebUserID'] });
    }
}
exports.WebUser = {
    uq: uqs_1.uqs.jkWebUser,
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
};
exports.WebUserContact = {
    uq: uqs_1.uqs.jkWebUser,
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
exports.WebUserCustomer = {
    uq: uqs_1.uqs.jkWebUser,
    type: 'map',
    entity: 'WebUserCustomer',
    mapper: {
        webUser: 'UserID',
        customer: 'CustomerID@Customer',
    }
};
exports.WebUserContacts = {
    uq: uqs_1.uqs.jkWebUser,
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
    pullWrite: async (joint, data) => {
        try {
            let addressId = data['CountyID'] || data['CityID'] || data['ProvinceID'] || data["CountryID"];
            if (addressId) {
                await joint.uqIn(Address_1.Address, { 'ID': addressId, 'CountryID': data['CountryID'], 'ProvinceID': data['ProvinceID'], 'CityID': data['CityID'] });
            }
            data['AddressID'] = addressId;
            await joint.uqIn(customer_1.Contact, data);
            let userId = -1;
            try {
                userId = await getUserId(data['WebUserID']);
            }
            catch (error) {
            }
            if (userId > 0) {
                await joint.uqIn(exports.WebUserContacts, { 'UserID': userId, 'ID': data['ContactID'] });
                if (data['IsDefault']) {
                    exports.WebUserSettingAlter.mapper.arr1["contentId"] = "^contentID@Contact";
                    let type = data["AddressType"] === 0 ? 'ivShippingContact' : 'ivInvoiceContact';
                    await joint.uqIn(exports.WebUserSettingAlter, { 'UserID': userId, 'Type': type, 'contentID': data['ContactID'] });
                }
            }
            return true;
        }
        catch (error) {
            logger_1.logger.error(error);
            throw error;
        }
    }
};
async function getUserId(webUserID) {
    let sql = `select id from \`${database_1.databaseName}\`.\`map_webuser\` where no='${webUserID}'`;
    let ret;
    try {
        ret = await tool_1.execSql(sql);
        if (ret.length === 1)
            return ret[0]['id'];
    }
    catch (err) {
        throw err;
    }
    return -1;
}
exports.WebUserSetting = {
    uq: uqs_1.uqs.jkWebUser,
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
exports.WebUserSettingAlter = {
    uq: uqs_1.uqs.jkWebUser,
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
exports.WebUserSettingType = {
    uq: uqs_1.uqs.jkWebUser,
    type: 'tuid',
    entity: 'WebUserSettingType',
    key: 'WebUserSettingTypeID',
    mapper: {
        $id: 'WebUserSettingTypeID@WebUserSettingType',
        description: "Description",
    }
};
//# sourceMappingURL=webUser.js.map