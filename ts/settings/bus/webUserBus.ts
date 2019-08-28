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
    push: async (joint: Joint, uqIn: UqBus, queue: number, data: any): Promise<boolean> => {
        let ret;
        let { id: tonvaId, Id } = data;
        if (Id && Id !== 'n/a') {
            try {
                ret = await userApiClient.ChangeRegisterInfo(data);
            } catch (error) {
                let { code, message } = error;
                logger.error('code:' + code + '; message:' + message + '; data:' + data);
                if (code === 400) {
                    return true;
                }
                return false;
            }
        }
        else {
            try {
                ret = await userApiClient.RegisterWebUser(data);
            } catch (error) {
                let { code } = error;
                logger.error(error + ';data:' + data);
                if (code === 409) {
                    return true;
                } else
                    return false;
            }
            if (ret !== undefined) {
                let { face } = uqIn;
                await map('webuser', tonvaId, ret.Identity);
            }
            return true;
        }
    }
}

export const faceWebUser: UqBus = {
    face: '百灵威系统工程部/WebUser/WebUser',
    from: 'local',
    mapper: {
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
        try {
            let { Name, FirstName, LastName } = data;
            if (!Name) {
                data.Name = FirstName + LastName;
            }
            console.log(data);
            let success = await userApiClient.UpdateWebUserBaseInfo(data);
            return success;
        } catch (error) {
            console.error(error);
            if (error.code === 400)
                return true;
            return false;
        }
    }
};

export const faceWebUserContact: UqBus = {
    face: '百灵威系统工程部/WebUser/WebUserContact',
    from: 'local',
    mapper: {
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
        try {
            let webUserParam = _.clone(data);
            if (data.address !== undefined) {
                let { country, province, city, county } = data.address;
                webUserParam.CountryName = country && country.chineseName;
                webUserParam.ProvinceName = province && province.chineseName;
                webUserParam.CityName = city && city.chineseName;
                webUserParam.CountyName = county && county.chineseName;
            }
            console.log(webUserParam);
            let success = await userApiClient.UpdateWebUserContact(webUserParam);
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
