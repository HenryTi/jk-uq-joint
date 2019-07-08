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
const promiseSize = config_1.default.get("promiseSize");
exports.WebUserTonva = {
    uq: uqs_1.uqs.jkWebUser,
    type: 'tuid',
    entity: 'WebUserTonva',
    key: 'WebUserID',
    mapper: {
        $type: 'Type',
        id: 'IGNORE',
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
                return;
            joint.uqIn(exports.WebUser, {
                'UserID': userId, 'WebUserID': data['WebUserID'], 'FirstName': data['FirstName'], 'Salutation': data['Salutation'],
                'OrganizationName': data['OrganizationName'], 'DepartmentName': data['DepartmentName']
            });
            let promises = [];
            promises.push(joint.uqIn(exports.WebUserContact, _.pick(data, ['WebUserID', 'Mobile', 'Email', 'OrganizationName', 'DepartmentName',
                'Telephone', 'Fax', 'ZipCode', 'WechatOpenID'])));
            promises.push(joint.uqIn(exports.WebUserCustomer, _.pick(data, ['WebUserID', 'CustomerID'])));
            // promises.push(joint.uqIn(WebUserSetting, _.pick(data, ['WebUserID', 'InvoiceTypeID'])));
            await Promise.all(promises);
            return true;
        }
        catch (error) {
            console.error(error);
            throw error;
        }
    }
};
exports.WebUser = {
    uq: uqs_1.uqs.jkWebUser,
    type: 'tuid',
    entity: 'WebUser',
    key: 'WebUserID',
    mapper: {
        id: 'UserID',
        no: "WebUserID",
        name: 'FirstName',
        firstName: "FirstName",
        lastName: "",
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
exports.WebUserCustomer = {
    uq: uqs_1.uqs.jkWebUser,
    type: 'map',
    entity: 'WebUserCustomer',
    mapper: {
        webUser: 'WebUserID@WebUser',
        arr1: {
            customer: '^CustomerID@Customer',
        }
    }
};
exports.WebUserContacts = {
    uq: uqs_1.uqs.jkWebUser,
    type: 'map',
    entity: 'WebUserContacts',
    mapper: {
        webUser: 'WebUserID@WebUser',
        arr1: {
            contact: '^ID@Contact',
        }
    }
};
exports.WebUserSetting = {
    uq: uqs_1.uqs.jkWebUser,
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
//# sourceMappingURL=webUser.js.map