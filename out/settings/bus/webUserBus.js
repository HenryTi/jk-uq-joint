"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.faceCustomerContractor = exports.faceWebUserCustomer = exports.faceWebUserContacts = exports.faceWebUserInvoice = exports.faceWebUserContact = exports.decryptUser = exports.faceWebUser = exports.faceUser = void 0;
const uq_joint_1 = require("uq-joint");
const uqs_1 = require("../uqs");
const UserApiClient_1 = require("../../tools/UserApiClient");
const logger_1 = require("../../tools/logger");
const lodash_1 = __importDefault(require("lodash"));
const webUser_1 = require("../in/webUser");
/**
 * 用于将中心服务器上客户注册信息发生的变化导入到官网系统中
 */
exports.faceUser = {
    face: '百灵威系统工程部/WebUser/User',
    from: 'center',
    mapper: {
        id: true,
        Id: 'id@WebUser',
        UserName: 'name',
        Password: 'pwd',
        // nice: false,
        // icon: false,
        // country: false,
        Mobile: 'mobile',
        Email: 'email',
    },
    /**
     * 仅处理已经导入就系统的注册信息的变更，不处理新注册客户信息导入（因为1.tonva上的注册客户不一定是商城的注册客户；2.tonva上注册后信息不全，也没法审核）
     */
    push: async (joint, uqIn, queue, data) => {
        let { Id } = data;
        if (Id && Id !== 'n/a') {
            if (data.Password) {
                try {
                    data.Password = uq_joint_1.decrypt(data.Password);
                }
                catch (error) {
                    return true;
                }
            }
            try {
                await UserApiClient_1.userApiClient.ChangeRegisterInfo(data);
            }
            catch (error) {
                let { code, message } = error;
                logger_1.logger.error('code:' + code + '; message:' + message + '; data:' + data);
                if (code === 400) {
                    return true;
                }
                return false;
            }
        }
        return true;
    }
};
/**
 * 用于将“我的服务器上”客户信息发生的变化导入到官网系统中
 */
exports.faceWebUser = {
    face: '百灵威系统工程部/WebUser/WebUser',
    from: 'local',
    mapper: {
        id: true,
        Id: 'id@WebUser',
        no: false,
        Name: 'name',
        FirstName: 'firstName',
        LastName: 'lastName',
        Title: 'gender',
        UnitName: 'organizationName',
        Department: 'departmentName',
    },
    push: async (joint, uqIn, queue, data) => {
        let { Id } = data;
        if (!Id || Id === 'n/a') {
            let no = await RegisterWebUser(data, joint);
            switch (no) {
                case -3:
                case -4:
                    return false;
                case -2:
                case -1:
                    return true;
                default:
                    data.Id = no;
                    break;
            }
        }
        try {
            let { Name, FirstName, LastName } = data;
            if (!Name) {
                data.Name = FirstName + LastName;
            }
            let success = await UserApiClient_1.userApiClient.UpdateWebUserBaseInfo(data);
            return success;
        }
        catch (error) {
            console.error(error + '; data: ' + data);
            if (error.code === 400)
                return true;
            return false;
        }
    }
};
function decryptUser(user) {
    let pwd = user.pwd;
    if (!pwd)
        user.pwd = '123456';
    else
        user.pwd = uq_joint_1.decrypt(pwd);
    if (!user.pwd)
        user.pwd = '123456';
    return user;
}
exports.decryptUser = decryptUser;
/**
 * 将在新系统中注册的用户导入到旧系统中；
 * @param user 从Bus中得到的User信息
 * @returns >0：表示在旧系统注册后生成的id; -1：表示在旧系统中注册发生冲突（即已经注册过了）；-2：表示从新系统中未获取到相应的注册信息;
 *  -3:表示调用中心服务器出现错误（需重试）；
 *  -4:表示调用旧系统接口出现超时（需重试）；
 */
async function RegisterWebUser(userIn, joint) {
    // 首先去获取到注册信息，去老系统中注册，怎么获取？需要Henry提供接口
    let userInCenter;
    try {
        //public async userOutOne(id: number) {
        let user = await uq_joint_1.centerApi.queueOutOne(userIn.id);
        if (user) {
            user = decryptUser(user);
            let mapFromUq = new uq_joint_1.MapFromUq(joint);
            userInCenter = await mapFromUq.map(user, exports.faceUser.mapper);
            //return outBody;
        }
        //}
        //userInCenter = await joint.userOutOne(user.id); // = Henry提供新接口
    }
    catch (error) {
        return -3;
    }
    if (!userInCenter)
        return -2;
    let ret;
    try {
        ret = await UserApiClient_1.userApiClient.RegisterWebUser(userInCenter);
    }
    catch (error) {
        let { code } = error;
        logger_1.logger.error(error);
        logger_1.logger.error(userInCenter);
        if (code !== 409)
            return -1;
        if (code === "ETIMEOUT")
            return -4;
    }
    if (ret !== undefined) {
        await uq_joint_1.map(uq_joint_1.getMapName(webUser_1.WebUser), userIn.id, ret.Identity);
        return ret.Identity;
    }
}
exports.faceWebUserContact = {
    face: '百灵威系统工程部/WebUser/WebUserContact',
    from: 'local',
    mapper: {
        webUser: true,
        Id: 'webUser@WebUser',
        Telephone: 'telephone',
        Mobile: 'mobile',
        Email: 'email',
        Fax: 'fax',
        ZipCode: 'zipCode',
        wechatID: false,
        Address: 'addressString',
        address: true,
    },
    uqIdProps: {
        address: {
            uq: uqs_1.uqs.jkCommon,
            tuid: 'Address',
            props: {
                country: true,
                province: true,
                city: true,
                county: true,
            }
        }
    },
    push: async (joint, uqIn, queue, data) => {
        let { Id } = data;
        if (!Id || Id === 'n/a') {
            data.id = data.webUser;
            let no = await RegisterWebUser(data, joint);
            switch (no) {
                case -3:
                case -4:
                    return false;
                case -2:
                case -1:
                    return true;
                default:
                    data.Id = no;
                    break;
            }
        }
        let webUserParam = lodash_1.default.clone(data);
        try {
            if (data.address !== undefined) {
                let { country, province, city, county } = data.address;
                webUserParam.CountryName = country && country.chineseName;
                webUserParam.ProvinceName = province && province.chineseName;
                webUserParam.CityName = city && city.chineseName;
                webUserParam.CountyName = county && county.chineseName;
            }
            let success = await UserApiClient_1.userApiClient.UpdateWebUserContact(webUserParam);
            return success;
        }
        catch (error) {
            console.error(error + '; data' + data);
            return false;
        }
    }
};
exports.faceWebUserInvoice = {
    face: '百灵威系统工程部/WebUser/WebUserInvoice',
    from: 'local',
    mapper: {
        webUser: true,
        Id: 'webUser@WebUser',
        InvoiceType: 'invoiceType',
        invoiceInfo: true,
    },
    uqIdProps: {
        invoiceInfo: {
            uq: uqs_1.uqs.jkCustomer,
            tuid: 'InvoiceInfo',
            props: {
                title: true,
                taxNo: true,
                address: true,
                telephone: false,
                bank: true,
                accountNo: true,
            }
        }
    },
    push: async (joint, uqIn, queue, data) => {
        let { Id } = data;
        if (!Id || Id === 'n/a') {
            data.id = data.webUser;
            let no = await RegisterWebUser(data, joint);
            switch (no) {
                case -3:
                case -4:
                    return false;
                case -2:
                case -1:
                    return true;
                default:
                    data.Id = no;
                    break;
            }
        }
        try {
            let param = lodash_1.default.clone(data);
            let { invoiceInfo } = data;
            if (invoiceInfo !== undefined) {
                let { title, taxNo, address, telephone, bank, accountNo } = invoiceInfo;
                param.AccountName = title;
                param.TaxNo = taxNo + " " + address + " " + telephone;
                param.TaxNumber = taxNo;
                param.RegisterAddress = address;
                param.RegisterTelephone = telephone;
                param.AccountBank = bank + " " + accountNo;
                param.Bank = bank;
                param.AccountNo = accountNo;
            }
            console.log(param);
            let success = await UserApiClient_1.userApiClient.UpdateWebUserInvoice(param);
            return success;
        }
        catch (error) {
            console.error(error);
            if (error.code === 400)
                return true;
            return false;
        }
    }
};
exports.faceWebUserContacts = {
    face: '百灵威系统工程部/WebUser/WebUserContacts',
    from: 'local',
    mapper: {
        id: true,
        Id: 'id@webUser',
        contact: true,
    },
    uqIdProps: {
        contact: {
            uq: uqs_1.uqs.jkCommon,
            tuid: 'Contact',
            props: {
                address: {
                    props: {
                        country: true,
                        province: true,
                        city: true,
                        county: true,
                    }
                }
            }
        }
    },
    push: async (joint, uqIn, queue, data) => {
        let { Id } = data;
        if (!Id || Id === 'n/a') {
            let no = await RegisterWebUser(data, joint);
            switch (no) {
                case -3:
                case -4:
                    return false;
                case -2:
                case -1:
                    return true;
                default:
                    data.Id = no;
                    break;
            }
        }
        try {
            let param = lodash_1.default.clone(data);
            let { name, organizationName, telephone, mobile, email, address, addressString } = data.contact;
            param.Name = name;
            param.Company = organizationName;
            param.Mobile = mobile;
            param.Phone = telephone;
            param.Email = email;
            param.Address = addressString;
            if (address !== null) {
                let { country, province, city, county } = address;
                param.CountryId = country && country.id;
                param.CountryName = country && country.chineseName;
                param.ProvinceId = province && province.id;
                param.Province = province && province.chineseName;
                param.CityId = city && city.id;
                param.City = city && city.chineseName;
                param.CountyId = county && county.id;
                param.CountyName = county && county.chineseName;
            }
            console.log(param);
            let success = await UserApiClient_1.userApiClient.AddWebUserContact(param);
            return success;
        }
        catch (error) {
            console.error(error);
            if (error.code === 400)
                return true;
            return false;
        }
    }
};
exports.faceWebUserCustomer = {
    face: '百灵威系统工程部/WebUser/WebUserCustomer',
    from: 'local',
    mapper: {
        WebUserId: 'id@webUser',
        CustomerId: 'customer@Customer',
    },
    push: async (joint, uqIn, queue, data) => {
        try {
            let success = await UserApiClient_1.userApiClient.MapWebUserToCustomer(data);
            return success;
        }
        catch (error) {
            console.error(error);
            if (error.code === 400)
                return true;
            return false;
        }
    }
};
exports.faceCustomerContractor = {
    face: '百灵威系统工程部/WebUser/CustomerContractor',
    from: 'local',
    mapper: {
        CustomerId: 'customer@Customer',
        ContractorId: 'contractor@Customer',
    },
    push: async (joint, uqIn, queue, data) => {
        try {
            let success = await UserApiClient_1.userApiClient.SetContractor(data);
            return success;
        }
        catch (error) {
            console.error(error);
            if (error.code === 400)
                return true;
            return false;
        }
    }
};
//# sourceMappingURL=webUserBus.js.map