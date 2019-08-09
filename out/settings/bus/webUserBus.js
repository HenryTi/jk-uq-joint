"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const uqs_1 = require("../uqs");
const webApiClient_1 = require("../../tools/webApiClient");
exports.faceUser = {
    face: '百灵威系统工程部/WebUser/User',
    from: 'center',
    mapper: {
        id: true,
        name: true,
        nice: false,
        icon: false,
        country: false,
        mobile: true,
        email: true,
        pwd: true,
    },
    push: async (joint, uqIn, queue, data) => {
        try {
            let success = await webApiClient_1.httpClient.RegisterWebUser(data);
            return success;
        }
        catch (error) {
            console.error(error);
            return false;
        }
    }
};
exports.faceWebUser = {
    face: '百灵威系统工程部/WebUser/WebUser',
    from: 'local',
    mapper: {
        id: false,
        no: true,
        name: true,
        firstName: true,
        lastName: true,
        gender: true,
        salutation: true,
        orgnizationName: true,
        departmentName: true,
    },
    push: async (joint, uqIn, queue, data) => {
        try {
            let success = await webApiClient_1.httpClient.UpdateWebUser(data);
            return success;
        }
        catch (error) {
            console.error(error);
            return false;
        }
    }
};
exports.faceWebUserContact = {
    face: '百灵威系统工程部/WebUser/WebUserContact',
    from: 'local',
    mapper: {
        webUser: false,
        telephone: true,
        mobile: true,
        email: true,
        fax: true,
        zipCode: true,
        wechatId: false,
        addressString: false,
        address: false,
    },
    uqIdProps: {
        webUser: {
            uq: uqs_1.uqs.jkWebUser,
            tuid: 'WebUser'
        }
    },
    push: async (joint, uqIn, queue, data) => {
        try {
            let success = await webApiClient_1.httpClient.UpdateWebUserContact(data);
            return success;
        }
        catch (error) {
            console.error(error);
            return false;
        }
    }
};
exports.faceWebUserInvoice = {
    face: '百灵威系统工程部/WebUser/WebUserInvoice',
    from: 'local',
    mapper: {
        webUser: false,
        title: true,
        taxNo: true,
        address: true,
        telephone: true,
        bank: true,
        accountNo: true,
    },
    uqIdProps: {
        webUser: {
            uq: uqs_1.uqs.jkWebUser,
            tuid: 'WebUser'
        }
    },
    push: async (joint, uqIn, queue, data) => {
        try {
            let success = await webApiClient_1.httpClient.UpdateWebUserInvoice(data);
            return success;
        }
        catch (error) {
            console.error(error);
            return false;
        }
    }
};
/*
Id: "no",
UserName: "",
Password: "",
Name: "name",
Sex: "gender",
UnitName: "orgnizationName",   // Compay?
DepartmentName: "departmentName",
Mobile: "mobile",
Tel: "telephone",
Fax: "fax",
PostCode: "zipCode",
Email: "email",
EmailTF: false,   //EmailPermit?
ProvinceName: "",
CityName: "",
Address: "",
InvoiceType: "",
InvoiceHeader: "",
Tax: "",
Account: "",
Distributor: false
*/ 
//# sourceMappingURL=webUserBus.js.map