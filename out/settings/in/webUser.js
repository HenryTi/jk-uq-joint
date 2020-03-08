"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const uq_joint_1 = require("uq-joint");
const uq_joint_2 = require("uq-joint");
const lodash_1 = __importDefault(require("lodash"));
const uqs_1 = require("../uqs");
const config_1 = __importDefault(require("config"));
const logger_1 = require("../../tools/logger");
const customer_1 = require("./customer");
const Address_1 = require("./Address");
const uqOutRead_1 = require("../../first/converter/uqOutRead");
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
    pull: `select top ${promiseSize} w.ID, w.WebUserID, '$user' as Type, w.UserName, w.Password, null as Nick, null as Icon
           , w.TrueName as FirstName, w.OrganizationName, w.DepartmentName, w.Salutation
           , w.Mobile, w.Telephone, w.Email, w.Fax, w.WechatOpenID
           , w.Country, w.Province, w.City, w.Address, w.ZipCode
           , w.InvoiceType, w.InvoiceTitle, w.TaxNo, w.BankAccountName
           , w.CustomerID, w.SalesRegionBelongsTo, w.SalesCompanyID
           from alidb.ProdData.dbo.Export_WebUser w
        where w.ID > @iMaxId and w.State in (1, 5) order by w.ID`,
    /**
     * WebUser的导入步骤：
     * 1.导入tonva系统，生成id;
     * 2.导入webUser/webUserContact中；
     * 3.如果有对应的customer，则导入webUserCustomer中;
     * 4.如果有对应的invoiceinfo，则需1.导入到common.invoiceinfo中；2.将生成的invoiceid写入到webuserSetting中（但不能覆盖该表中其他数据），
     *      为此目的，使用了webusersettingalter表，数据先导入此表，在手动导入到webusersetting表中；
     * 5.invoicetype的导入同invoiceinfo;
     */
    pullWrite: async (joint, uqin, data) => {
        try {
            //let userId = await joint.userIn(
            let userId = await userIn(joint, exports.WebUserTonva, lodash_1.default.pick(data, ['Type', 'WebUserID', 'UserName', 'Password', 'Nick', 'Icon', 'Mobile', 'Email', 'WechatOpenID']));
            if (userId < 0)
                return true;
            data.UserID = userId;
            let promises = [];
            promises.push(joint.uqIn(exports.WebUser, lodash_1.default.pick(data, ['UserID', 'WebUserID', 'FirstName', 'Salutation', 'OrganizationName', 'DepartmentName'])));
            promises.push(joint.uqIn(exports.WebUserContact, lodash_1.default.pick(data, ['UserID', 'Mobile', 'Email', 'OrganizationName', 'DepartmentName',
                'Telephone', 'Fax', 'ZipCode', 'WechatOpenID', 'Address'])));
            if (data['CustomerID'])
                promises.push(joint.uqIn(exports.WebUserCustomer, lodash_1.default.pick(data, ['UserID', 'CustomerID'])));
            if (data['InvoiceTitle'])
                promises.push(InvoiceInfoIn(joint, data, userId));
            if (data['InvoiceType']) {
                let invoiceTypeId = data['InvoiceType'] === '增值发票' ? 2 : 1;
                exports.WebUserSettingAlter.mapper.arr1["contentId"] = "^contentID";
                promises.push(joint.uqIn(exports.WebUserSettingAlter, { 'UserID': userId, 'Type': 'ivInvoiceType', 'contentID': invoiceTypeId }));
            }
            // 仅账号是本人的情况下，才在此处导入Tonva系统，非本人的情况下，通过WebUserBuyerAccount的设置单独导入
            /*
            if (!data['BuyerAccountID'])
                promises.push(joint.uqIn(WebUserBuyerAccount, { 'WebUserID': data['WebUserID'], 'BuyerAccountID': data['BuyerAccountID'] }));
            */
            await Promise.all(promises);
            return true;
        }
        catch (error) {
            logger_1.logger.error(error);
            throw error;
        }
    }
};
async function tryUserIn(body, mapUserToUq) {
    try {
        let ret = await uq_joint_1.centerApi.queueIn(body);
        if (ret === undefined || typeof ret !== 'number') {
            console.error(body);
            let { id: code, message } = ret;
            switch (code) {
                case -2:
                    body.email += '\t';
                    ret = await tryUserIn(body, mapUserToUq);
                    break;
                case -3:
                    body.mobile += '\t';
                    ret = await tryUserIn(body, mapUserToUq);
                    break;
                default:
                    console.error(ret);
                    ret = -5;
                    break;
            }
        }
        return ret;
    }
    catch (error) {
        console.error(error);
        return -1;
    }
}
async function userIn(joint, uqIn, data) {
    let { key, mapper, uq: uqFullName, entity: tuid } = uqIn;
    if (key === undefined)
        throw 'key is not defined';
    if (uqFullName === undefined)
        throw 'tuid ' + tuid + ' not defined';
    let keyVal = data[key];
    let mapToUq = new uq_joint_2.MapUserToUq(joint);
    try {
        let body = await mapToUq.map(data, mapper);
        if (body.id <= 0) {
            delete body.id;
        }
        let ret = await tryUserIn(body, mapToUq);
        if (!body.id && ret > 0) {
            // await map(tuid, ret, keyVal);
            await uq_joint_1.map(exports.WebUser.entity, ret, keyVal);
        }
        return body.id || ret;
    }
    catch (error) {
        throw error;
    }
}
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
/*
*/
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
    pull: async (joint, uqMap, queue) => {
        let sql = `select top ${promiseSize} wa.ID, wa.AddressID as ContactID, wa.WebUserID, wa.Name, wa.OrganizationName, wa.Mobile, wa.Telephone
           , wa.CountryID, wa.ProvinceID, wa.CityID, wa.[Address] as Addr, wa.ZipCode, wa.Email, wa.IsDefault, wa.AddressType
           from alidb.ProdData.dbo.Export_WebUserAddress wa
           inner join alidb.jk_eb.dbo.ClientLogin cl on cl.CIID = wa.WebUserID
           where wa.ID > @iMaxId and cl.State in (0, 1, 5) order by wa.ID`;
        let ret = await uqOutRead_1.uqOutRead(sql, queue);
        let { data } = ret;
        let dataCopy = [];
        for (let i = data.length - 1; i >= 0; i--) {
            const element = data[i];
            // if (dataCopy.lastIndexOf(element["AddressID"]) >= 0)
            if (dataCopy.findIndex(e => e.AddressID === element.AddressID) > 0)
                continue;
            dataCopy.push(element);
        }
        ret.data = dataCopy;
        return ret;
    },
    /**
     *
     */
    pullWrite: async (joint, uqin, data) => {
        try {
            let userId = -1;
            try {
                userId = await uq_joint_1.getUserId(data['WebUserID']);
            }
            catch (error) {
            }
            if (userId <= 0)
                throw 'web user not import, wait next. ID:' + data['ID'];
            let addressId = data['CountyID'] || data['CityID'] || data['ProvinceID'] || data["CountryID"];
            if (addressId) {
                await joint.uqIn(Address_1.Address, { 'ID': addressId, 'CountryID': addressId.substr(0, 2), 'ProvinceID': data['ProvinceID'], 'CityID': data['CityID'] });
            }
            data['AddressID'] = addressId;
            await joint.uqIn(customer_1.Contact, data);
            await joint.uqIn(exports.WebUserContacts, { 'UserID': userId, 'ID': data['ContactID'] });
            if (data['IsDefault']) {
                exports.WebUserSettingAlter.mapper.arr1["contentId"] = "^contentID@Contact";
                let type = data["AddressType"] === 0 ? 'ivShippingContact' : 'ivInvoiceContact';
                await joint.uqIn(exports.WebUserSettingAlter, { 'UserID': userId, 'Type': type, 'contentID': data['ContactID'] });
            }
            return true;
        }
        catch (error) {
            logger_1.logger.error(error);
            throw error;
        }
    }
};
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
exports.WebUserBuyerAccount = {
    uq: uqs_1.uqs.jkWebUser,
    type: 'map',
    entity: 'WebUserBuyerAccount',
    mapper: {
        webUser: 'WebUserID@WebUser',
        arr1: {
            buyerAccount: '^BuyerAccountID@BuyerAccount',
        }
    },
};
//# sourceMappingURL=webUser.js.map