import { Fetch } from "../uq-joint/tool/fetch";
import config from 'config';

const userApiBaseUrl = config.get<string>("userApiBaseUrl");

class UserApiClient extends Fetch {

    constructor() {
        super(userApiBaseUrl);
    }

    async RegisterWebUser(data: any): Promise<any> {
        let ret;
        try {
            ret = await this.post("TonvaUser/SignUp", data);
        } catch (error) {
            throw error;
        }
        return ret;
    }

    async ChangeRegisterInfo(data: any): Promise<any> {
        let ret;
        try {
            ret = await this.post("TonvaUser/ChangeRegisterInfo", data);
        } catch (error) {
            throw error;
        }
        return ret;
    }

    async UpdateWebUserBaseInfo(data: any): Promise<boolean> {
        let ret;
        try {
            ret = await this.post("TonvaUser/UpdateBaseInfo", data);
        } catch (error) {
            throw error;
        }
        return ret;
    }

    async UpdateWebUserContact(data: any): Promise<boolean> {
        let ret;
        try {
            ret = await this.post("TonvaUser/UpdateContact", data);
        } catch (error) {
            throw error;
        }
        return ret;
    }

    async UpdateWebUserInvoice(data: any): Promise<boolean> {
        let ret;
        try {
            ret = await this.post("TonvaUser/UpdateInvoice", data);
        } catch (error) {
            throw error;
        }
        return ret;
    }

    async AddWebUserContact(data: any): Promise<boolean> {
        let ret;
        try {
            ret = await this.post("TonvaUser/AddConsignee", data);
        } catch (error) {
            throw error;
        }
        return ret;
    }

    async MapWebUserToCustomer(data: any): Promise<boolean> {
        let ret;
        try {
            ret = await this.post("TonvaUser/MapToCustomerInner", data);
        } catch (error) {
            throw error;
        }
        return ret;
    }

    async SetContractor(data: any): Promise<boolean> {
        let ret;
        try {
            ret = await this.post("TonvaUser/SetContractor", data);
        } catch (error) {
            throw error;
        }
        return ret;
    }
}

export const userApiClient = new UserApiClient();