import { UqBus, Joint } from "../../uq-joint";
import { uqs } from "../uqs";
import { userApiClient } from "../../tools/UserApiClient";
import { map } from "../../uq-joint/tool/map";
import { logger } from "../../tools/logger";
import _ from 'lodash';

export const faceUser: UqBus = {
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
    push: async (joint: Joint, uqIn: UqBus, queue: number, data: any): Promise<boolean> => {
        let { Id } = data;
        if (Id && Id !== 'n/a') {
            try {
                await userApiClient.ChangeRegisterInfo(data);
            } catch (error) {
                let { code, message } = error;
                logger.error('code:' + code + '; message:' + message + '; data:' + data);
                if (code === 400) {
                    return true;
                }
                return false;
            }
        }
    }
}

export const faceWebUser: UqBus = {
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
    push: async (joint: Joint, uqIn: UqBus, queue: number, data: any): Promise<boolean> => {
        let { Id } = data;
        if (!Id || Id === 'n/a') {
            let no = await RegisterWebUser(data);
            if (no < 0)
                return false;
            else
                data.Id = no;
        }

        try {
            let { Name, FirstName, LastName } = data;
            if (!Name) {
                data.Name = FirstName + LastName;
            }
            let success = await userApiClient.UpdateWebUserBaseInfo(data);
            return success;
        } catch (error) {
            console.error(error + '; data: ' + data);
            if (error.code === 400)
                return true;
            return false;
        }
    }
};

async function RegisterWebUser(data: any) {
    // 首先去获取到注册信息，去老系统中注册，怎么获取？需要Henry提供接口
    let dataCenter; // = Henry提供新接口
    let ret;
    try {
        ret = await userApiClient.RegisterWebUser(dataCenter);
    } catch (error) {
        let { code } = error;
        logger.error(error + ';data:' + dataCenter);
        if (code !== 409) {
            return -1;
        }
    }
    if (ret !== undefined) {
        await map('webuser', data.id, ret.Identity);
        return ret.Identity;
    }
}

export const faceWebUserContact: UqBus = {
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
            uq: uqs.jkCommon,
            tuid: 'Address',
            props: {
                country: true,
                province: true,
                city: true,
                county: true,
            }
        }
    },
    push: async (joint: Joint, uqIn: UqBus, queue: number, data: any): Promise<boolean> => {
        let { Id } = data;
        if (!Id || Id === 'n/a') {
            data.id = data.webUser;
            let no = await RegisterWebUser(data);
            if (no < 0)
                return false;
            else
                data.Id = no;
        }

        let webUserParam = _.clone(data);
        try {
            if (data.address !== undefined) {
                let { country, province, city, county } = data.address;
                webUserParam.CountryName = country && country.chineseName;
                webUserParam.ProvinceName = province && province.chineseName;
                webUserParam.CityName = city && city.chineseName;
                webUserParam.CountyName = county && county.chineseName;
            }
            let success = await userApiClient.UpdateWebUserContact(webUserParam);
            return success;
        } catch (error) {
            console.error(error + '; data' + data);
            return false;
        }
    }
};

export const faceWebUserInvoice: UqBus = {
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
            uq: uqs.jkCustomer,
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
    push: async (joint: Joint, uqIn: UqBus, queue: number, data: any): Promise<boolean> => {
        let { Id } = data;
        if (!Id || Id === 'n/a') {
            data.id = data.webUser;
            let no = await RegisterWebUser(data);
            if (no < 0)
                return false;
            else
                data.Id = no;
        }

        try {
            let param = _.clone(data);

            let { invoiceInfo } = data;
            if (invoiceInfo !== undefined) {
                let { title, taxNo, address, telephone, bank, accountNo } = invoiceInfo;
                param.AccountName = title;
                param.TaxNo = taxNo + " " + address + " " + telephone;
                param.AccountBank = bank + " " + accountNo;
            }
            console.log(param);
            let success = await userApiClient.UpdateWebUserInvoice(param);
            return success;
        } catch (error) {
            console.error(error);
            if (error.code === 400)
                return true;
            return false;
        }
    }
};


export const faceWebUserContacts: UqBus = {
    face: '百灵威系统工程部/WebUser/WebUserContacts',
    from: 'local',
    mapper: {
        id: true,
        Id: 'id@webUser',
        contact: true,
    },
    uqIdProps: {
        contact: {
            uq: uqs.jkCommon,
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
    push: async (joint: Joint, uqIn: UqBus, queue: number, data: any): Promise<boolean> => {
        let { Id } = data;
        if (!Id || Id === 'n/a') {
            let no = await RegisterWebUser(data);
            if (no < 0)
                return false;
            else
                data.Id = no;
        }

        try {
            let param = _.clone(data);
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
            let success = await userApiClient.AddWebUserContact(param);
            return success;
        } catch (error) {
            console.error(error);
            if (error.code === 400)
                return true;
            return false;
        }
    }
};

export const faceWebUserCustomer: UqBus = {
    face: '百灵威系统工程部/WebUser/WebUserCustomer',
    from: 'local',
    mapper: {
        WebUserId: 'id@webUser',
        CustomerId: 'customer@Customer',
    },
    push: async (joint: Joint, uqIn: UqBus, queue: number, data: any): Promise<boolean> => {
        try {
            let success = await userApiClient.MapWebUserToCustomer(data);
            return success;
        } catch (error) {
            console.error(error);
            if (error.code === 400)
                return true;
            return false;
        }
    }
};

export const faceCustomerContractor: UqBus = {
    face: '百灵威系统工程部/WebUser/CustomerContractor',
    from: 'local',
    mapper: {
        CustomerId: 'customer@Customer',
        ContractorId: 'contractor@Customer',
    },
    push: async (joint: Joint, uqIn: UqBus, queue: number, data: any): Promise<boolean> => {
        try {
            let success = await userApiClient.SetContractor(data);
            return success;
        } catch (error) {
            console.error(error);
            if (error.code === 400)
                return true;
            return false;
        }
    }
};
