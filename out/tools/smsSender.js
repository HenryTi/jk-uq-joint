"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SmsSender = void 0;
const config_1 = __importDefault(require("config"));
const node_fetch_1 = __importDefault(require("node-fetch"));
const smsServer = config_1.default.get("smsServer");
class SmsSender {
    /*
    constructor() {
        super(smsServer.baseUrl);
    }
    */
    async sendMessage(message) {
        let { baseUrl, un, pw, dc, tf, mobile, messageHeader } = smsServer;
        message = encodeURI(messageHeader + message);
        let response = await node_fetch_1.default(`${baseUrl}mt?un=${un}&pw=${pw}&da=${mobile}&dc=${dc}&tf=${tf}&sm=${message}`, undefined);
        if (response.status === 200) {
            let result = await response.text();
        }
    }
}
exports.SmsSender = SmsSender;
//# sourceMappingURL=smsSender.js.map