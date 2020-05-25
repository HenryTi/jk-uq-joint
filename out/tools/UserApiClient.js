"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userApiClient = void 0;
const uq_joint_1 = require("uq-joint");
const config_1 = __importDefault(require("config"));
const userApiBaseUrl = config_1.default.get("userApiBaseUrl");
class UserApiClient extends uq_joint_1.Fetch {
    constructor() {
        super(userApiBaseUrl);
    }
    async RegisterWebUser(data) {
        let ret;
        try {
            ret = await this.post("TonvaUser/SignUp", data);
        }
        catch (error) {
            throw error;
        }
        return ret;
    }
    async ChangeRegisterInfo(data) {
        let ret;
        try {
            ret = await this.post("TonvaUser/ChangeRegisterInfo", data);
        }
        catch (error) {
            throw error;
        }
        return ret;
    }
    async UpdateWebUserBaseInfo(data) {
        let ret;
        try {
            ret = await this.post("TonvaUser/UpdateBaseInfo", data);
        }
        catch (error) {
            throw error;
        }
        return ret;
    }
    async UpdateWebUserContact(data) {
        let ret;
        try {
            ret = await this.post("TonvaUser/UpdateContact", data);
        }
        catch (error) {
            throw error;
        }
        return ret;
    }
    async UpdateWebUserInvoice(data) {
        let ret;
        try {
            ret = await this.post("TonvaUser/UpdateInvoice", data);
        }
        catch (error) {
            throw error;
        }
        return ret;
    }
    async AddWebUserContact(data) {
        let ret;
        try {
            ret = await this.post("TonvaUser/AddConsignee", data);
        }
        catch (error) {
            throw error;
        }
        return ret;
    }
    async MapWebUserToCustomer(data) {
        let ret;
        try {
            ret = await this.post("TonvaUser/MapToCustomerInner", data);
        }
        catch (error) {
            throw error;
        }
        return ret;
    }
    async SetContractor(data) {
        let ret;
        try {
            ret = await this.post("TonvaUser/SetContractor", data);
        }
        catch (error) {
            throw error;
        }
        return ret;
    }
}
exports.userApiClient = new UserApiClient();
//# sourceMappingURL=UserApiClient.js.map