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
            ret = await this.post("/User/RegisterUser", data);
        } catch (error) {
            throw error;
        }
        if (ret && !ret.Success)
            throw {
                code: 'ENAMEUSED',
                message: ret.Message
            }
        return ret;
    }

    async UpdateWebUser(data: any): Promise<boolean> {
        return false;
    }

    async UpdateWebUserContact(data: any): Promise<boolean> {
        return false;
    }

    async UpdateWebUserInvoice(data: any): Promise<boolean> {
        return false;
    }
}

export const userApiClient = new UserApiClient();