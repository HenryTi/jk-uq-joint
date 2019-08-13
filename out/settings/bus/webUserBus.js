"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const uqs_1 = require("../uqs");
const UserApiClient_1 = require("../../tools/UserApiClient");
const map_1 = require("../../uq-joint/tool/map");
const logger_1 = require("../../tools/logger");
exports.faceUser = {
    face: '百灵威系统工程部/WebUser/User',
    from: 'center',
    mapper: {
        id: 'id@WebUser',
        UserName: 'name',
        Password: 'pwd',
        // nice: false,
        // icon: false,
        // country: false,
        Mobile: 'mobile',
        Email: 'email',
    },
    push: async (joint, uqIn, queue, data) => {
        let ret;
        try {
            let { innerId } = data;
            if (innerId !== 'n/a') {
                ret = await UserApiClient_1.userApiClient.UpdateWebUserContact(data);
            }
            else {
                ret = await UserApiClient_1.userApiClient.RegisterWebUser(data);
            }
        }
        catch (error) {
            let { code, message } = error;
            if (code === 'ENAMEUSED') {
                logger_1.logger.error(error + ';data:' + data);
                return true;
            }
            else
                return false;
        }
        if (ret !== undefined) {
            let { face } = uqIn;
            await map_1.map('$bus/' + face, data.id, ret.Identity);
        }
        return true;
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
            let success = await UserApiClient_1.userApiClient.UpdateWebUser(data);
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
            let success = await UserApiClient_1.userApiClient.UpdateWebUserContact(data);
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
            let success = await UserApiClient_1.userApiClient.UpdateWebUserInvoice(data);
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