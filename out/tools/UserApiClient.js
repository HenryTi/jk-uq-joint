"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fetch_1 = require("../uq-joint/tool/fetch");
const config_1 = __importDefault(require("config"));
const userApiBaseUrl = config_1.default.get("userApiBaseUrl");
class UserApiClient extends fetch_1.Fetch {
    constructor() {
        super(userApiBaseUrl);
    }
    async RegisterWebUser(data) {
        let ret;
        try {
            ret = await this.post("/User/RegisterUser", data);
        }
        catch (error) {
            throw error;
        }
        if (ret && !ret.Success)
            throw {
                code: 'ENAMEUSED',
                message: ret.Message
            };
        return ret;
    }
    async UpdateWebUser(data) {
        return false;
    }
    async UpdateWebUserContact(data) {
        return false;
    }
    async UpdateWebUserInvoice(data) {
        return false;
    }
}
exports.userApiClient = new UserApiClient();
//# sourceMappingURL=UserApiClient.js.map