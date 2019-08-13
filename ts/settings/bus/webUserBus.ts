import { UqBus, Joint } from "../../uq-joint";
import { uqs } from "../uqs";
import { userApiClient } from "../../tools/UserApiClient";
import { map } from "../../uq-joint/tool/map";
import { logger } from "../../tools/logger";

export const faceUser: UqBus = {
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
    push: async (joint: Joint, uqIn: UqBus, queue: number, data: any): Promise<boolean> => {
        let ret;
        try {
            let { innerId } = data;
            if (innerId !== 'n/a') {
                ret = await userApiClient.UpdateWebUserContact(data);
            }
            else {
                ret = await userApiClient.RegisterWebUser(data);
            }
        } catch (error) {
            let { code, message } = error;
            if (code === 'ENAMEUSED') {
                logger.error(error + ';data:' + data);
                return true;
            } else
                return false;
        }
        if (ret !== undefined) {
            let { face } = uqIn;
            await map('$bus/' + face, data.id, ret.Identity);
        }
        return true;
    }
}

export const faceWebUser: UqBus = {
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
    push: async (joint: Joint, uqIn: UqBus, queue: number, data: any): Promise<boolean> => {
        try {
            let success = await userApiClient.UpdateWebUser(data);
            return success;
        } catch (error) {
            console.error(error);
            return false;
        }
    }
};

export const faceWebUserContact: UqBus = {
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
            uq: uqs.jkWebUser,
            tuid: 'WebUser'
        }
    },
    push: async (joint: Joint, uqIn: UqBus, queue: number, data: any): Promise<boolean> => {
        try {
            let success = await userApiClient.UpdateWebUserContact(data);
            return success;
        } catch (error) {
            console.error(error);
            return false;
        }
    }
};

export const faceWebUserInvoice: UqBus = {
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
            uq: uqs.jkWebUser,
            tuid: 'WebUser'
        }
    },
    push: async (joint: Joint, uqIn: UqBus, queue: number, data: any): Promise<boolean> => {
        try {
            let success = await userApiClient.UpdateWebUserInvoice(data);
            return success;
        } catch (error) {
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